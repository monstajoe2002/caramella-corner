import { createServerFn } from '@tanstack/react-start'
import { OrderWithCustomer } from '@/db/types'
import * as Sentry from '@sentry/tanstackstart-react'
import { getOrdersWithCustomers } from './db'

export const getOrders = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getOrders' }, async () => {
    return await getOrdersWithCustomers()
  })
})
