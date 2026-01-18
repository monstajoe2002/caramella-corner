import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  getProductById as getProductByIdDb,
  getProductsWithVariants as getProductsWithVariantsDb,
  getProductsByCategorySlug as getProductsByCategorySlugDb,
  insertProduct,
  deleteProduct as deleteProductDb,
  updateProduct,
} from './db'
import slugify from 'slugify'
import { productSchema } from '@/lib/zod-schemas'
import * as Sentry from '@sentry/tanstackstart-react'
export const getProductsWithVariants = createServerFn().handler(async () => {
  return await Sentry.startSpan(
    { name: 'getProductsWithVariants' },
    async () => {
      return await getProductsWithVariantsDb()
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
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    return await Sentry.startSpan({ name: 'getProductById' }, async () => {
      return await getProductByIdDb(id)
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
      return {
        error: false,
        message: 'Product created successfully',
      }
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

      return {
        error: false,
        message: 'Product updated successfully',
      }
    })
  })
