import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  getSubcategoriesByCategoryId as getSubcategoriesByCategoryIdDb,
  getCategoriesWithSubcategories as getCategoriesWithSubcategoriesDb,
  getCategories as getCategoriesDb,
  deleteCategory as deleteCategoryDb,
  getCategoryById as getCategoryByIdDb,
  insertCategory,
  updateCategory,
} from './db'
import { redirect } from '@tanstack/react-router'
const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  subcategories: z
    .array(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      }),
    )
    .min(1),
})
export const getCategories = createServerFn({ method: 'GET' }).handler(
  getCategoriesDb,
)
export const getSubcategoriesByCategoryId = createServerFn({ method: 'GET' })
  .inputValidator((data: { categoryId: string }) => data)
  .handler(async ({ data: { categoryId } }) => {
    return await getSubcategoriesByCategoryIdDb(categoryId)
  })
export const getCategoryById = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    return await getCategoryByIdDb(id)
  })

export const getCategoriesWithSubcategories = createServerFn().handler(
  async () => await getCategoriesWithSubcategoriesDb(),
)

export const createCategory = createServerFn({ method: 'POST' })
  .inputValidator(categorySchema)
  .handler(async ({ data }) => {
    const newCat = await insertCategory(data)
    if (!newCat) {
      return {
        error: true,
        message: 'Error creating category',
      }
    }
    throw redirect({ href: '..', replace: true })
  })

export const deleteCategory = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const deletedCat = await deleteCategoryDb(data.id)
    if (!deletedCat) {
      return {
        error: true,
        message: 'Error creating category',
      }
    }
    return {
      error: false,
    }
  })

export const editCategory = createServerFn({ method: 'POST' })
  .inputValidator(
    categorySchema.extend({
      id: z.uuid().min(1),
    }),
  )
  .handler(async ({ data: { id, ...data } }) => {
    // TODO: Fix invalidation
    const newCat = await updateCategory(id, data)
    if (!newCat) {
      return {
        error: true,
        message: 'Error creating category',
      }
    }
    throw redirect({ to: '/admin/categories', replace: true })
  })
