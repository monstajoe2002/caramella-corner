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
import slugify from 'slugify'
import * as Sentry from '@sentry/tanstackstart-react'
const categorySchema = z.object({
  name: z.string().min(1),
  // slug: z.string().min(1),
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
  async () => {
    return await Sentry.startSpan({ name: 'getCategories' }, async () => {
      return await getCategoriesDb()
    })
  },
)
export const getSubcategoriesByCategoryId = createServerFn({ method: 'GET' })
  .inputValidator((data: { categoryId: string }) => data)
  .handler(async ({ data: { categoryId } }) => {
    return await Sentry.startSpan(
      { name: 'getSubcategoriesByCategoryId' },
      async () => {
        return await getSubcategoriesByCategoryIdDb(categoryId)
      },
    )
  })
export const getCategoryById = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    return await Sentry.startSpan({ name: 'getCategoryById' }, async () => {
      return await getCategoryByIdDb(id)
    })
  })

export const getCategoriesWithSubcategories = createServerFn().handler(
  async () => {
    return await Sentry.startSpan(
      { name: 'getCategoriesWithSubcategories' },
      async () => {
        return await getCategoriesWithSubcategoriesDb()
      },
    )
  },
)

export const createCategory = createServerFn({ method: 'POST' })
  .inputValidator(categorySchema)
  .handler(async ({ data: unsafeData }) => {
    return await Sentry.startSpan({ name: 'createCategory' }, async () => {
      const { success, data } = categorySchema.safeParse(unsafeData)
      if (!success) {
        return {
          error: true,
          message: 'Invalid category data',
        }
      }
      await insertCategory({
        ...data,
        slug: slugify(data.name, { lower: true }),
      })
      throw redirect({ href: '..', replace: true })
    })
  })

export const deleteCategory = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await Sentry.startSpan({ name: 'deleteCategory' }, async () => {
      const deletedCat = await deleteCategoryDb(data.id)
      return deletedCat
    })
  })

export const editCategory = createServerFn({ method: 'POST' })
  .inputValidator(
    categorySchema.extend({
      id: z.uuid().min(1),
    }),
  )
  .handler(async ({ data: { id, ...unsafeData } }) => {
    return await Sentry.startSpan({ name: 'editCategory' }, async () => {
      const { success, data } = categorySchema
        .extend({
          id: z.uuid().min(1),
        })
        .safeParse(unsafeData)
      if (!success) {
        return {
          error: true,
          message: 'Invalid category data',
        }
      }
      await updateCategory(id, {
        ...data,
        slug: slugify(data.name, { lower: true }),
      })

      throw redirect({ to: '/admin/categories', replace: true })
    })
  })
