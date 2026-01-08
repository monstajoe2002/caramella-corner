import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import { insertOrder } from './db'
import { orderSchema } from '@/lib/zod-schemas'
export const placeOrder = createServerFn({ method: 'POST' })
  .inputValidator(orderSchema)
  .handler(async ({ data: unsafeData }) => {
    return await Sentry.startSpan({ name: 'createOrder' }, async () => {
      const { success, data } = orderSchema.safeParse(unsafeData)
      if (!success) {
        return {
          error: true,
          message: 'Error creating product',
        }
      }
      await insertOrder(
        {
          ...data,
          price: String(data.price),
          orderItems: data.orderItems.map((item) => ({
            ...item,
            priceAtOrder: String(item.priceAtOrder),
          })),
        },
        { ...data.addressInfo, ...data.customerInfo },
      )

      // throw redirect({ href: '..', replace: true })
    })
  })
