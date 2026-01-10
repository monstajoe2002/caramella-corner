import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import {
  getTotalRevenue as getTotalRevenueDb,
  getNewCustomersCount as getNewCustomersCountDb,
  getTotalOrders as getTotalOrdersDb,
  getActiveProductsCount as getActiveProductsCountDb,
} from './db'

export const getTotalRevenue = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await Sentry.startSpan({ name: 'getTotalRevenue' }, async () => {
      return await getTotalRevenueDb()
    })
  },
)

export const getNewCustomers = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await Sentry.startSpan({ name: 'getNewCustomers' }, async () => {
      return await getNewCustomersCountDb({ days: 30 })
    })
  },
)

export const getTotalOrders = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await Sentry.startSpan({ name: 'getTotalOrders' }, async () => {
      return await getTotalOrdersDb()
    })
  },
)

export const getActiveProducts = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await Sentry.startSpan({ name: 'getActiveProducts' }, async () => {
      return await getActiveProductsCountDb()
    })
  },
)
