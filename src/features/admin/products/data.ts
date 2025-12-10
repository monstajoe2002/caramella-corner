import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  getProductById as getProductByIdDb,
  getProductsWithVariants as getProductsWithVariantsDb,
  insertProduct,
  deleteProduct as deleteProductDb,
} from './db'
import slugify from 'slugify'
import { productSchema } from '@/lib/schemas'
import { redirect } from '@tanstack/react-router'
import * as Sentry from '@sentry/tanstackstart-react'
export const getProductsWithVariants = createServerFn().handler(async () => {
  return await Sentry.startSpan(
    { name: 'getProductsWithVariants' },
    async () => {
      return await getProductsWithVariantsDb()
    },
  )
})
export const getProductById = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    return await Sentry.startSpan({ name: 'getProductById' }, async () => {
      return await getProductByIdDb(id)
    })
  })

export const createProduct = createServerFn({ method: 'POST' })
  .inputValidator(productSchema.extend({ slug: z.string().min(1).slugify() }))
  .handler(async ({ data }) => {
    return await Sentry.startSpan({ name: 'createProduct' }, async () => {
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
  })
export const deleteProduct = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await Sentry.startSpan({ name: 'deleteProduct' }, async () => {
      const deletedCat = await deleteProductDb(data.id)
      if (!deletedCat) {
        return {
          error: true,
          message: 'Error creating product',
        }
      }
      return {
        error: false,
      }
    })
  })
