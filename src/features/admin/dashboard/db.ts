import { db } from '@/db'
import { customers, orders, payments, products } from '@/db/schema'
import { eq, sql, gte } from 'drizzle-orm'

export async function getTotalRevenue() {
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
    })
    .from(payments)
    .where(eq(payments.status, 'completed'))

  return Number(result[0]?.total || 0)
}

export async function getNewCustomersCount(days: number = 30) {
  const dateThreshold = new Date()
  dateThreshold.setDate(dateThreshold.getDate() - days)

  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(customers)
    .where(gte(customers.createdAt, dateThreshold))

  return Number(result[0]?.count || 0)
}

export async function getTotalOrders() {
  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(orders)

  return Number(result[0]?.count || 0)
}

export async function getActiveProductsCount() {
  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(eq(products.active, true))

  return Number(result[0]?.count || 0)
}
