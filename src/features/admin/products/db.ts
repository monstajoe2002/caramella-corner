import { db } from '@/db'
import { products, variants } from '@/db/schema'
import { NewProductWithVariants } from '@/db/types'
import { eq } from 'drizzle-orm'
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
