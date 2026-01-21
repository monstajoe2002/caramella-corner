import { db } from '@/db'
import { categories, subcategories } from '@/db/schema'
import { NewCategoryWithSubcategories } from '@/db/types'
import { and, eq, notInArray } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'

export async function getCategories() {
  return await db.query.categories.findMany()
}
export async function getCategoryById(id: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
    with: {
      subcategories: true,
    },
  })

  if (category == null) throw notFound()
  return category
}
export async function getCategoryBySlug(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      subcategories: true,
    },
  })

  if (category == null) throw notFound()
  return category
}
export async function getCategoriesWithSubcategories() {
  return await db.query.categories.findMany({
    with: { subcategories: true },
  })
}

export async function insertCategory(category: NewCategoryWithSubcategories) {
  return db.transaction(async (trx) => {
    const [newCat] = await trx.insert(categories).values(category).returning()
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
    const [newCat] = await trx
      .update(categories)
      .set(updatedCategory)
      .where(eq(categories.id, id))
      .returning()

    if (updatedCategory.subcategories) {
      // Extract IDs from updated subcategories (only valid, existing IDs)
      const updatedIds = updatedCategory.subcategories
        .map((sc) => sc.id)
        .filter((id) => id != null && id.trim().length > 0) as string[]

      // Find subcategories to be deleted
      const subcatsToDelete = await trx.query.subcategories.findMany({
        where:
          updatedIds.length > 0
            ? and(
                eq(subcategories.categoryId, id),
                notInArray(subcategories.id, updatedIds),
              )
            : eq(subcategories.categoryId, id),
      })

      // Check if any of these subcategories have products
      if (subcatsToDelete.length > 0) {
        // Safe to delete - no products associated
        if (updatedIds.length > 0) {
          await trx
            .delete(subcategories)
            .where(
              and(
                eq(subcategories.categoryId, id),
                notInArray(subcategories.id, updatedIds),
              ),
            )
        } else {
          await trx
            .delete(subcategories)
            .where(eq(subcategories.categoryId, id))
        }
      }

      for (const subcat of updatedCategory.subcategories) {
        // Check if this is an existing subcategory with a valid database ID

        // Validate it's a proper UUID format
        const isExistingSubcat = subcat.id && subcat.id.trim().length > 0

        if (isExistingSubcat) {
          // Update existing subcategory by id
          await trx
            .update(subcategories)
            .set({
              name: subcat.name,
              slug: subcat.slug,
            })
            .where(eq(subcategories.id, subcat.id!))
        } else {
          // Insert new subcategory
          await trx.insert(subcategories).values({
            name: subcat.name,
            slug: subcat.slug,
            categoryId: id,
          })
        }
      }
    }
    return newCat
  })
}

// subcategories

export async function getSubcategoriesByCategoryId(categoryId: string) {
  return await db.query.subcategories.findMany({
    where: eq(subcategories.categoryId, categoryId),
  })
}
