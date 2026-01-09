import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import {
  getOrdersWithCustomers,
  getOrderById as getOrderByIdDb,
  updateOrderStatus as updateOrderStatusDb,
} from './db'
import { orderStatusEnum } from '@/db/schema'

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

export const updateOrderStatus = createServerFn()
  .inputValidator(
    (input: {
      orderId: string
      status: (typeof orderStatusEnum.enumValues)[number]
    }) => input,
  )
  .handler(async ({ data }) => {
    return await Sentry.startSpan({ name: 'updateOrderStatus' }, async () => {
      await updateOrderStatusDb(data.orderId, data.status)
    })
  })
