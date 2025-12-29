import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  getProductById as getProductByIdDb,
  getProductBySlug as getProductBySlugDb,
  getProductsWithVariants as getProductsWithVariantsDb,
  getProductsByCategorySlug as getProductsByCategorySlugDb,
  insertProduct,
  deleteProduct as deleteProductDb,
  updateProduct,
} from './db'
import slugify from 'slugify'
import { productSchema } from '@/lib/schemas'
import { redirect } from '@tanstack/react-router'
import * as Sentry from '@sentry/tanstackstart-react'
export const getProductsWithVariants = createServerFn()
  .inputValidator((data: { activeOnly?: boolean }) => data)
  .handler(async ({ data }) => {
    return await Sentry.startSpan(
      { name: 'getProductsWithVariants' },
      async () => {
        const activeOnly = data?.activeOnly ?? false
        return await getProductsWithVariantsDb(activeOnly)
      },
    )
  })

export const getProductsByCategorySlug = createServerFn()
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data: { slug } }) => {
    return await Sentry.startSpan(
      { name: 'getProductsByCategorySlug' },
      async () => {
        return await getProductsByCategorySlugDb(slug)
      },
    )
  })

export const getProductById = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string; activeOnly?: boolean }) => data)
  .handler(async ({ data: { id, activeOnly } }) => {
    return await Sentry.startSpan({ name: 'getProductById' }, async () => {
      return await getProductByIdDb(id, activeOnly ?? false)
    })
  })

export const getProductBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string; activeOnly?: boolean }) => data)
  .handler(async ({ data: { slug, activeOnly } }) => {
    return await Sentry.startSpan({ name: 'getProductBySlug' }, async () => {
      return await getProductBySlugDb(slug, activeOnly ?? false)
    })
  })
export const createProduct = createServerFn({ method: 'POST' })
  .inputValidator(productSchema.extend({ slug: z.string().min(1).slugify() }))
  .handler(async ({ data: unsafeData }) => {
    return await Sentry.startSpan({ name: 'createProduct' }, async () => {
      const { success, data } = productSchema
        .extend({ slug: z.string().min(1).slugify() })
        .safeParse(unsafeData)
      if (!success) {
        return {
          error: true,
          message: 'Error creating product',
        }
      }
      await insertProduct({
        ...data,
        slug: slugify(data.name, { lower: true }),
        discount: data.discount / 100,
        price: String(data.price),
      })

      throw redirect({ href: '..', replace: true })
    })
  })
export const deleteProduct = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await Sentry.startSpan({ name: 'deleteProduct' }, async () => {
      const deletedProduct = await deleteProductDb(data.id)
      if (!deletedProduct) {
        return {
          error: true,
          message: 'Cannot delete product',
        }
      }
      return {
        error: false,
        message: 'Product deleted',
      }
    })
  })
export const editProduct = createServerFn({ method: 'POST' })
  .inputValidator(
    productSchema.extend({
      id: z.uuid().min(1),
    }),
  )
  .handler(async ({ data: { id, ...unsafeData } }) => {
    return await Sentry.startSpan({ name: 'editProduct' }, async () => {
      const { success, data } = productSchema.safeParse(unsafeData)
      if (!success) {
        return {
          error: true,
          message: 'Invalid product data',
        }
      }
      await updateProduct(id, {
        ...data,
        slug: slugify(data.name, { lower: true }),
        discount: data.discount / 100,
        price: String(data.price),
      })

      throw redirect({ to: '/admin/products', replace: true })
    })
  })
