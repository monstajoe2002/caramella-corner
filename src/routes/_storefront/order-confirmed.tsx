import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
const searchSchema = z.object({
  o: z.string().nonempty(),
})
export const Route = createFileRoute('/_storefront/order-confirmed')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  return (
    <div>
      Order Confirmed! Thank you for your purchase. We've sent a confirmation to
      your email.
    </div>
  )
}
