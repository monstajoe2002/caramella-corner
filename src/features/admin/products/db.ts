import { db } from '@/db'
import { categories, images, products, variants } from '@/db/schema'
import { NewProductWithVariants } from '@/db/types'
import { and, eq, inArray, notInArray } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
import { imagekit } from '@/lib/imagekit'
import { priceAfterDiscount } from '@/db/schema-helpers'

export async function getProductsWithVariants() {
  return await db.query.products.findMany({
    with: { variants: true, category: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
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
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
  })

  if (product == null) throw notFound()
  return product
}
export async function getProductsByCategorySlug(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  })

  if (category == null) throw notFound()

  return await db.query.products.findMany({
    where: eq(products.categoryId, category.id),
    with: { variants: true, category: true, images: true, subcategory: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
  })
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
  // Get product images before deletion
  const productImages = await db.query.images.findMany({
    where: eq(images.productId, id),
  })

  // Delete product from database
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning()

  // Bulk delete all images in product folder from ImageKit
  if (productImages.length > 0) {
    await imagekit.deleteFolder(`products/${deletedProduct.slug}`)
  }
  return deletedProduct
}

export async function updateProduct(
  id: string,
  updatedProduct: NewProductWithVariants,
) {
  return db.transaction(async (trx) => {
    // Update main category fields
    const [newProduct] = await trx
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
      // Fetch existing images to determine what to delete
      const existingImages = await trx.query.images.findMany({
        where: eq(images.productId, id),
      })

      const existingIds = existingImages.map((img) => img.id)
      const updatedIds = updatedProduct.images
        .map((img) => img.id)
        .filter((id): id is string => id != null)

      // IDs that exist in DB but not in updated list => should be deleted
      const removedIds = existingIds.filter((eid) => !updatedIds.includes(eid))

      if (removedIds.length > 0) {
        console.log(`Deleting images with ids: ${removedIds.join(', ')}`)

        // Delete files from ImageKit first
        const removedIkFileIds = existingImages
          .filter((img) => removedIds.includes(img.id))
          .map((img) => img.ikFileId)

        if (removedIkFileIds.length > 0) {
          await imagekit.bulkDeleteFiles(removedIkFileIds)
        }

        // Delete images from database
        await trx.delete(images).where(inArray(images.id, removedIds))
      }

      // Insert only new images (ones without an id)
      const newImages = updatedProduct.images.filter((img) => !img.id)
      if (newImages.length > 0) {
        await trx.insert(images).values(
          newImages.map((img) => ({
            ...img,
            productId: id,
          })),
        )
      }
    }

    return newProduct
  })
}
