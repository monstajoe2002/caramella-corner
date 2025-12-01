import { db } from '@/db'
import { categories, subcategories } from '@/db/schema'
import { NewCategoryWithSubcategories } from '@/db/types'
import slugify from 'slugify'

export async function createCategory(category: NewCategoryWithSubcategories) {
  return db.transaction(async (trx) => {
    const [newCat] = await db
      .insert(categories)
      .values({ ...category, slug: slugify(category.slug) })
      .returning()
    if (category.subcategories?.length) {
      const subcatValues = category.subcategories.map((subcat) => ({
        ...subcat,
        slug: slugify(subcat.slug),
        categoryId: newCat.id,
      }))
      await trx.insert(subcategories).values(subcatValues)
    }

    return newCat
  })
}
