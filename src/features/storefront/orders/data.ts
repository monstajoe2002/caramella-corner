import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import { insertOrder } from './db'
import z from 'zod'
import { addressFormSchema, customerFormSchema } from '@/lib/zod-schemas'
export const createOrder = createServerFn({ method: 'POST' })
  .inputValidator(addressFormSchema.extend(customerFormSchema))
  .handler(async ({ data: unsafeData }) => {
    return await Sentry.startSpan({ name: 'createOrder' }, async () => {
      const { success, data } = addressFormSchema
        .extend({ slug: z.string().min(1).slugify() })
        .safeParse(unsafeData)
      if (!success) {
        return {
          error: true,
          message: 'Error creating product',
        }
      }
      await insertOrder({
        ...data,
        slug: slugify(data.name, { lower: true }),
        discount: data.discount / 100,
        price: String(data.price),
      })

      throw redirect({ href: '..', replace: true })
    })
  })
