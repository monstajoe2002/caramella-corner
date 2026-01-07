import { db } from '@/db'
import { customers, orderItems, orders, payments } from '@/db/schema'
import { Customer, NewOrderWithItems } from '@/db/types'
import { generateOrderNumber } from '@/lib/utils'
import { eq } from 'drizzle-orm'

// TODO: Refactor this function to accept a payment method as an argument
export async function insertOrder(
  order: Omit<NewOrderWithItems, 'orderNumber' | 'status'>,
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
      await trx
        .insert(orderItems)
        .values(orderItemsValues)
        .then(async () => {
          await trx.insert(payments).values({
            amount: order.price,
            paymentMethod: 'cash',
            status: 'pending',
          })
        })
        .catch(() => trx.rollback())
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
