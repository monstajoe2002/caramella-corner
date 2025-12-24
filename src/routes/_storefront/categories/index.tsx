import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_storefront/categories/"!</div>
}
