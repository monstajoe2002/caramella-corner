import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  getProductsWithVariants as getProductsWithVariantsDb,
  insertProduct,
  deleteProduct as deleteProductDb,
} from './db'
import slugify from 'slugify'
import { productSchema } from '@/lib/schemas'
import { redirect } from '@tanstack/react-router'
export const getCategoriesWithSubcategories = createServerFn().handler(
  getProductsWithVariantsDb,
)

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
export const deleteProduct = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
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
