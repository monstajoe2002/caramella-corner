import { createServerFn } from '@tanstack/react-start'
import { getActiveProducts as getActiveProductsDb } from './db'
import * as Sentry from '@sentry/tanstackstart-react'
export const getActiveProducts = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getActiveProducts' }, async () => {
    return await getActiveProductsDb()
  })
})
