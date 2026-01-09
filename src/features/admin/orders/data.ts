import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import { getOrdersWithCustomers, getOrderById as getOrderByIdDb } from './db'

export const getOrders = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getOrders' }, async () => {
    return await getOrdersWithCustomers()
  })
})

export const getOrderById = createServerFn()
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    return await Sentry.startSpan({ name: 'getOrderById' }, async () => {
      return await getOrderByIdDb(data.id)
    })
  })
