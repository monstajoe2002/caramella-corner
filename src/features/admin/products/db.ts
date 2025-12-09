import { db } from '@/db'
import { products, variants } from '@/db/schema'
import { NewProductWithVariants } from '@/db/types'

export async function insertProduct(product: NewProductWithVariants) {
  return db.transaction(async (trx) => {
    const [newProduct] = await db.insert(products).values(product).returning()
    if (product.variants?.length) {
      const variantValues = product.variants.map((v) => ({
        ...v,
        productId: v.productId,
      }))
      await trx.insert(variants).values(variantValues)
    }

    return newProduct
  })
}
