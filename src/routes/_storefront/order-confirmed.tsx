import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/order-confirmed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_storefront/order-confirmed"!</div>
}
