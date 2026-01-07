import { db } from '@/db'
import { orderItems, orders } from '@/db/schema'
import { NewOrderWithItems } from '@/db/types'
import { generateOrderNumber } from '@/lib/utils'

export async function insertOrder(order: NewOrderWithItems) {
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
      const orderItemsValues = order.orderItems
      await trx.insert(orderItems).values(orderItemsValues)
    }

    return newOrder
  })
}
