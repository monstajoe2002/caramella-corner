import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import { insertOrder, getOrderById as getOrderByIdDb } from './db'
import { orderSchema } from '@/lib/zod-schemas'
import { sendConfirmationEmail } from '@/lib/email'

export const getOrderById = createServerFn()
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    return await Sentry.startSpan({ name: 'getOrderById' }, async () => {
      return await getOrderByIdDb(id)
    })
  })

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
      const res = await insertOrder(
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
      if (success)
        sendConfirmationEmail(data.customerInfo.email, res.orderNumber)
      return { data: res }
    })
  })
