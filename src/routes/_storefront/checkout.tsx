import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/checkout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_storefront/checkout"!</div>
}
