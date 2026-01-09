import { db } from '@/db'
import {
  customers,
  orderItems,
  orders,
  payments,
  products,
  variants,
} from '@/db/schema'
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

      await trx
        .insert(orderItems)
        .values(orderItemsValues)
        .then(async () => {
          await trx.insert(payments).values({
            amount: order.price,
            paymentMethod: 'cash',
            status: 'pending',
            orderId: newOrder.id,
          })

          // Use join to get variant and product data for all order items in one query
          const itemsWithProducts = await trx
            .select({
              variantId: orderItems.variantId,
              quantityOrdered: orderItems.quantity,
              productQuantity: products.quantity,
              productId: products.id,
            })
            .from(orderItems)
            .innerJoin(variants, eq(orderItems.variantId, variants.id))
            .innerJoin(products, eq(variants.productId, products.id))
            .where(eq(orderItems.orderId, newOrder.id))

          // Aggregate total quantities per product
          const quantityByProduct: Record<
            string,
            { productQuantity: number; totalOrdered: number }
          > = {}
          for (const item of itemsWithProducts) {
            if (!quantityByProduct[item.productId]) {
              quantityByProduct[item.productId] = {
                productQuantity: Number(item.productQuantity),
                totalOrdered: 0,
              }
            }
            quantityByProduct[item.productId].totalOrdered += Number(
              item.quantityOrdered,
            )
          }

          // Update quantities per product
          for (const productId in quantityByProduct) {
            const { productQuantity, totalOrdered } =
              quantityByProduct[productId]
            await trx
              .update(products)
              .set({ quantity: productQuantity - totalOrdered })
              .where(eq(products.id, productId))
          }
        })
        .catch(() => trx.rollback())
    }

    if (newOrder) {
      const payment = await trx.query.payments.findFirst({
        columns: {
          id: true,
        },
        where: eq(payments.orderId, newOrder.id),
      })
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
