import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { insertCategory } from './db'
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

export const getCategories = createServerFn().handler(async () => {
  return await db.query.categories.findMany({
    with: { subcategories: true },
  })
})
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
