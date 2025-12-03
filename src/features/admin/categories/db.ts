import { db } from '@/db'
import { categories, subcategories } from '@/db/schema'
import { NewCategoryWithSubcategories } from '@/db/types'
import { eq } from 'drizzle-orm'

export async function insertCategory(category: NewCategoryWithSubcategories) {
  return db.transaction(async (trx) => {
    const [newCat] = await db.insert(categories).values(category).returning()
    if (category.subcategories?.length) {
      const subcatValues = category.subcategories.map((subcat) => ({
        ...subcat,
        categoryId: newCat.id,
      }))
      await trx.insert(subcategories).values(subcatValues)
    }

    return newCat
  })
}
export async function deleteCategory(id: string) {
  return await db.delete(categories).where(eq(categories.id, id))
}
export async function updateCategory(
  id: string,
  category: NewCategoryWithSubcategories,
) {
  throw new Error('Not implemented')
}
