import { createServerFn } from '@tanstack/react-start'
import {
  getActiveProducts as getActiveProductsDb,
  getProductBySlug as getProductBySlugDb,
} from './db'
import * as Sentry from '@sentry/tanstackstart-react'
export const getActiveProducts = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getActiveProducts' }, async () => {
    return await getActiveProductsDb()
  })
})
export const getProductBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data: { slug } }) => {
    return await Sentry.startSpan({ name: 'getProductBySlug' }, async () => {
      return await getProductBySlugDb(slug)
    })
  })
