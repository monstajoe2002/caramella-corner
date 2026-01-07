import { db } from '@/db'
import { customers, orderItems, orders } from '@/db/schema'
import { Customer, NewOrderWithItems } from '@/db/types'
import { generateOrderNumber } from '@/lib/utils'
import { eq } from 'drizzle-orm'

export async function insertOrder(
  order: NewOrderWithItems,
  customerInfo: Pick<Customer, 'name' | 'email' | 'address'>,
) {
  return db.transaction(async (trx) => {
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        status: 'pending',
        orderNumber: generateOrderNumber(),
      })
      .returning()
    if (order.orderItems?.length) {
      const orderItemsValues = order.orderItems.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }))
      await trx.insert(orderItems).values(orderItemsValues)
    }
    if (newOrder) {
      await trx
        .update(customers)
        .set({ name: customerInfo.name, address: customerInfo.address })
        .where(eq(customers.email, customerInfo.email))
    }
    return newOrder
  })
}
