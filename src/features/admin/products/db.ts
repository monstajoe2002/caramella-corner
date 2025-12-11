import { db } from '@/db'
import { products, variants } from '@/db/schema'
import { NewProductWithVariants } from '@/db/types'
import { and, eq, notInArray } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
export async function getProductsWithVariants() {
  return await db.query.products.findMany({
    with: { variants: true, category: true },
  })
}
export async function getProductById(id: string) {
  const todo = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      variants: true,
      category: true,
      subcategory: true,
    },
  })

  if (todo == null) throw notFound()
  return todo
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
        .map((sc) => sc.id)
        .filter((id) => id != null)

      // Delete variants not present in updated list
      await trx
        .delete(variants)
        .where(
          and(eq(variants.productId, id), notInArray(variants.id, updatedIds)),
        )

      for (const subcat of updatedProduct.variants) {
        if (subcat.id) {
          // Update existing variant by id
          await trx
            .update(variants)
            .set(subcat)
            .where(eq(variants.id, subcat.id))
        } else {
          // Insert new variant
          await trx.insert(variants).values({
            ...subcat,
            productId: id,
          })
        }
      }
    }
    return newProduct
  })
}
