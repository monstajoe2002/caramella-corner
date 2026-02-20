import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import { getPaymentsWithOrders } from './db'

export const getPayments = createServerFn().handler(async () => {
  return await Sentry.startSpan({ name: 'getPayments' }, async () => {
    return await getPaymentsWithOrders()
  })
})
