import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/products/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_storefront/products/$slug"!</div>
}
