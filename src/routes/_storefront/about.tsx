import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_storefront/about"!</div>
}
