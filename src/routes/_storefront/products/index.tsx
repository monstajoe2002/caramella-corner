import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Products</h1>
      <p>Browse all our exclusive products</p>
    </div>
  )
}
