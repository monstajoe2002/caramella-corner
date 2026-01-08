import { db } from '@/db'
import { customers, orderItems, orders, payments } from '@/db/schema'
import { Customer, NewOrderWithItems } from '@/db/types'
import { generateOrderNumber } from '@/lib/utils'
import { eq } from 'drizzle-orm'

// TODO: Refactor this function to accept a payment method as an argument
export async function insertOrder(
  order: Omit<NewOrderWithItems, 'orderNumber' | 'status'>,
  customerInfo: Pick<Customer, 'name' | 'email' | 'address' | 'id'>,
) {
  return db.transaction(async (trx) => {
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        status: 'pending',
        orderNumber: generateOrderNumber(),
        customerId: customerInfo.id,
      })
      .returning()
    if (order.orderItems?.length) {
      const orderItemsValues = order.orderItems.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }))
      // insert order items
      await trx
        .insert(orderItems)
        .values(orderItemsValues)
        .then(async () => {
          // then, create a payment record
          await trx.insert(payments).values({
            amount: order.price,
            paymentMethod: 'cash',
            status: 'pending',
            orderId: newOrder.id,
          })
        })
        .catch(() => trx.rollback())
    }
    // if successful update customer address if empty and link order to payment
    if (newOrder) {
      const payment = await trx.query.payments.findFirst({
        columns: {
          id: true,
        },
        where: eq(payments.orderId, newOrder.id),
      })
      // and get product details
      await trx
        .update(customers)
        .set({ name: customerInfo.name, address: customerInfo.address })
        .where(eq(customers.email, customerInfo.email))
        .then(async () => {
          await trx
            .update(orders)
            .set({ customerId: customerInfo.id, paymentId: payment?.id })
            .where(eq(orders.id, newOrder.id))
        })
        .catch(() => trx.rollback())
    }
    return newOrder
  })
}
