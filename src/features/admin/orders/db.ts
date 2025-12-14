import { db } from '@/db'
import { orders, customers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getOrdersWithCustomers() {
  return await db.query.orders.findMany({
    with: { customer: true, payment: true },
  })
}

export async function getOrderById(id: string) {
  return await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      customer: true,
      orderItems: true,
      payment: true,
    },
  })
}
