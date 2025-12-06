import { db } from '@/db'
import { categories, subcategories } from '@/db/schema'
import { NewCategoryWithSubcategories } from '@/db/types'
import { and, eq, notInArray } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'

export async function getCategoryById(id: string) {
  const todo = await db.query.categories.findFirst({
    where: eq(categories.id, id),
    with: {
      subcategories: true,
    },
  })

  if (todo == null) throw notFound()
  return todo
}
export async function getCategoryBySlug(slug: string) {
  const todo = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      subcategories: true,
    },
  })

  if (todo == null) throw notFound()
  return todo
}

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
  updatedCategory: NewCategoryWithSubcategories,
) {
  return db.transaction(async (trx) => {
    // Update main category fields
    const [newCat] = await db
      .update(categories)
      .set(updatedCategory)
      .where(eq(categories.id, id))
      .returning()

    if (updatedCategory.subcategories) {
      // Extract IDs from updated subcategories
      const updatedIds = updatedCategory.subcategories
        .map((sc) => sc.id)
        .filter((id) => id != null)

      // Delete subcategories not present in updated list
      await trx
        .delete(subcategories)
        .where(
          and(
            eq(subcategories.categoryId, id),
            notInArray(subcategories.id, updatedIds),
          ),
        )

      for (const subcat of updatedCategory.subcategories) {
        if (subcat.id) {
          // Update existing subcategory by id
          await trx
            .update(subcategories)
            .set(subcat)
            .where(eq(subcategories.id, subcat.id))
        } else {
          // Insert new subcategory
          await trx.insert(subcategories).values({
            ...subcat,
            categoryId: id,
          })
        }
      }
    }
    return newCat
  })
}
