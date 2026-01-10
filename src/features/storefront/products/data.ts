import { createServerFn } from '@tanstack/react-start'
import {
  getActiveProducts as getActiveProductsDb,
  getProductBySlug as getProductBySlugDb,
  searchActiveProducts as searchActiveProductsDb,
  getActiveProductsCount as getActiveProductsCountDb,
  searchActiveProductsCount as searchActiveProductsCountDb,
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
  .inputValidator(
    (data: {
      query: string
      limit?: number
      offset?: number
    }) => data,
  )
  .handler(async ({ data }) => {
    const query = data.query
    const limit = data.limit
    const offset = data.offset
    return await Sentry.startSpan(
      { name: 'searchActiveProducts' },
      async () => {
        return await searchActiveProductsDb(query, limit, offset)
      },
    )
  })

export const getActiveProductsCount = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await Sentry.startSpan(
      { name: 'getActiveProductsCount' },
      async () => {
        return await getActiveProductsCountDb()
      },
    )
  })

export const searchActiveProductsCount = createServerFn({ method: 'GET' })
  .inputValidator((data: { query: string }) => data)
  .handler(async ({ data: { query } }) => {
    return await Sentry.startSpan(
      { name: 'searchActiveProductsCount' },
      async () => {
        return await searchActiveProductsCountDb(query)
      },
    )
  })
