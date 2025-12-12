import { db } from '@/db'
import { images, products, variants } from '@/db/schema'
import { NewProductWithVariants } from '@/db/types'
import { and, eq, notInArray } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
import { imagekit } from '@/lib/imagekit'
export async function getProductsWithVariants() {
  return await db.query.products.findMany({
    with: { variants: true, category: true },
  })
}
export async function getProductById(id: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      variants: true,
      category: true,
      subcategory: true,
      images: true,
    },
  })

  if (product == null) throw notFound()
  return product
}
export async function insertProduct(product: NewProductWithVariants) {
  return db.transaction(async (trx) => {
    const [newProduct] = await db.insert(products).values(product).returning()
    if (product.variants?.length) {
      const variantValues = product.variants.map((v) => ({
        ...v,
        productId: newProduct.id,
      }))
      await trx.insert(variants).values(variantValues)
    }
    if (product.images?.length) {
      const imageValues = product.images.map((img) => ({
        ...img,
        productId: newProduct.id,
      }))
      await trx.insert(images).values(imageValues)
    }

    return newProduct
  })
}
export async function deleteProduct(id: string) {
  return await db.delete(products).where(eq(products.id, id))
}
export async function updateProduct(
  id: string,
  updatedProduct: NewProductWithVariants,
) {
  return db.transaction(async (trx) => {
    // Update main category fields
    const [newProduct] = await db
      .update(products)
      .set(updatedProduct)
      .where(eq(products.id, id))
      .returning()

    if (updatedProduct.variants) {
      // Extract IDs from updated variants
      const updatedIds = updatedProduct.variants
        .map((v) => v.id)
        .filter((id) => id != null)

      // Delete variants not present in updated list
      await trx
        .delete(variants)
        .where(
          and(eq(variants.productId, id), notInArray(variants.id, updatedIds)),
        )

      for (const variant of updatedProduct.variants) {
        if (variant.id) {
          // Update existing variant by id
          await trx
            .update(variants)
            .set(variant)
            .where(eq(variants.id, variant.id))
        } else {
          // Insert new variant
          await trx.insert(variants).values({
            ...variant,
            productId: id,
          })
        }
      }
    }
    if (updatedProduct.images) {
      // Extract IDs from updated images
      const updatedIds = updatedProduct.images
        .map((img) => img.id)
        .filter((id) => id != null)
      const updatedFileIds = updatedProduct.images
        .map((img) => img.ikFileId)
        .filter((ikFileId) => ikFileId != null)
      // Delete images not present in updated list

      await trx
        .delete(images)
        .where(and(eq(images.productId, id), notInArray(images.id, updatedIds)))
        .then(async () => {
          await imagekit.bulkDeleteFiles(updatedFileIds)
        })

      for (const image of updatedProduct.images) {
        if (image.id) {
          // Update existing image by id
          await trx.update(images).set(image).where(eq(images.id, image.id))
        } else {
          // Insert new image
          await trx.insert(images).values({
            ...image,
            productId: id,
          })
        }
      }
    }
    return newProduct
  })
}
