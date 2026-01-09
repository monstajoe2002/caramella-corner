import { db } from '@/db'
import { orders, orderStatusEnum } from '@/db/schema'
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
      orderItems: {
        with: {
          variant: {
            with: {
              product: true,
            },
          },
        },
      },
      payment: true,
    },
  })
}

export async function updateOrderStatus(
  orderId: string,
  status: (typeof orderStatusEnum.enumValues)[number],
) {
  await db.update(orders).set({ status }).where(eq(orders.id, orderId))
}
