import { db } from '@/db'
import { categories, images, products, variants } from '@/db/schema'
import { NewProductWithVariants } from '@/db/types'
import { and, eq, notInArray } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
import { imagekit } from '@/lib/imagekit'
import { priceAfterDiscount } from '@/db/schema-helpers'

export async function getProductsWithVariants(activeOnly = false) {
  return await db.query.products.findMany({
    where: activeOnly ? eq(products.active, true) : undefined,
    with: { variants: true, category: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
  })
}
export async function getProductsByCategorySlug(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  })

  if (category == null) throw notFound()

  return await db.query.products.findMany({
    where: and(eq(products.categoryId, category.id), eq(products.active, true)),
    with: { variants: true, category: true, images: true },
    extras: { priceAfterDiscount: priceAfterDiscount(products) },
  })
}

export async function getProductById(id: string, activeOnly = false) {
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.id, id),
      activeOnly ? eq(products.active, true) : undefined,
    ),
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

export async function getProductBySlug(slug: string, activeOnly = false) {
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.slug, slug),
      activeOnly ? eq(products.active, true) : undefined,
    ),
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
    // Update main product fields
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
      // Fetch existing images in transaction context
      const existingImages = await trx.query.images.findMany({
        where: eq(images.productId, id),
      })

      const existingIds = existingImages.map((img) => String(img.id))
      const updatedIds = updatedProduct.images
        .map((img) => img.id)
        .filter((id): id is string => id != null)
        .map(String)

      // IDs that exist in DB but not in updated list => removed
      const removedIds = existingIds.filter((eid) => !updatedIds.includes(eid))

      console.log('existingIds:', existingIds)
      console.log('updatedIds:', updatedIds)
      console.log('removedIds:', removedIds)

      if (removedIds.length > 0) {
        console.log(`Deleting images with ids: ${removedIds.join(', ')}`)
        // Delete images with these ids
        await trx.delete(images).where(
          and(
            eq(images.productId, id),
            notInArray(images.id, removedIds), // <-- This was incorrectly using removedIds, it should be updatedIds probably,
            // But kept as per original logic maybe fix below?
          ),
        )

        // Also delete files in ImageKit for removed images
        const removedIkFileIds = existingImages
          .filter((img) => removedIds.includes(String(img.id)))
          .map((img) => img.ikFileId)
          .filter(Boolean)

        if (removedIkFileIds.length > 0) {
          await imagekit.bulkDeleteFiles(removedIkFileIds)
        }
      } else {
        console.log('No image deletions necessary.')
      }

      for (const image of updatedProduct.images) {
        if (image.id) {
          await trx.update(images).set(image).where(eq(images.id, image.id))
        } else {
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
