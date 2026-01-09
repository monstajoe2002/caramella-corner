import { createServerFn } from '@tanstack/react-start'
import {
  getActiveProducts as getActiveProductsDb,
  getProductBySlug as getProductBySlugDb,
  searchActiveProducts as searchActiveProductsDb,
} from './db'
import * as Sentry from '@sentry/tanstackstart-react'
export const getActiveProducts = createServerFn({ method: 'GET' })
  .inputValidator((data?: { limit?: number; offset?: number }) => data)
  .handler(async ({ data }) => {
    const limit = data?.limit
    const offset = data?.offset
    return await Sentry.startSpan({ name: 'getActiveProducts' }, async () => {
      return await getActiveProductsDb({ limit, offset })
    })
  })
export const getProductBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data: { slug } }) => {
    return await Sentry.startSpan({ name: 'getProductBySlug' }, async () => {
      return await getProductBySlugDb(slug)
    })
  })

export const searchActiveProducts = createServerFn({ method: 'GET' })
  .inputValidator((data: { query: string }) => data)
  .handler(async ({ data: { query } }) => {
    return await Sentry.startSpan(
      { name: 'searchActiveProducts' },
      async () => {
        return await searchActiveProductsDb(query)
      },
    )
  })
