import { db } from '@/db'
import { categories, subcategories } from '@/db/schema'
import { NewCategoryWithSubcategories } from '@/db/types'

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
