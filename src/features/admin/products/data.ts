import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { insertProduct } from './db'
import slugify from 'slugify'
import { productSchema } from '@/lib/schemas'
import { redirect } from '@tanstack/react-router'
// Product form schema based on drizzle-orm products schema

export const createProduct = createServerFn({ method: 'POST' })
  .inputValidator(productSchema.extend({ slug: z.string().min(1).slugify() }))
  .handler(async ({ data }) => {
    const newProduct = await insertProduct({
      ...data,
      slug: slugify(data.name, { lower: true }),
      price: String(data.price),
    })
    if (!newProduct) {
      return {
        error: true,
        message: 'Error creating product',
      }
    }
    throw redirect({ href: '..', replace: true })
  })
