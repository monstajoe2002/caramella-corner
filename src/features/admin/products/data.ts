import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { insertCategory } from './db'
import slugify from 'slugify'
import { productSchema } from '@/lib/schemas'
import { redirect } from '@tanstack/react-router'
// Product form schema based on drizzle-orm products schema

export const createCategory = createServerFn({ method: 'POST' })
  .inputValidator(productSchema.extend({ slug: z.string().min(1).slugify() }))
  .handler(async ({ data }) => {
    const newCat = await insertCategory({
      ...data,
      slug: slugify(data.name, { lower: true }),
    })
    if (!newCat) {
      return {
        error: true,
        message: 'Error creating category',
      }
    }
    throw redirect({ href: '..', replace: true })
  })
