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
  return <div>Hello "/_storefront/order-confirmed"!</div>
}
