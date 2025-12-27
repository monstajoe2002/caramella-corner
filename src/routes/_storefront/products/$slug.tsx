import { getProductBySlug } from '@/features/admin/products/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/products/$slug')({
  component: RouteComponent,
  loader: ({ params: { slug } }) => getProductBySlug({ data: { slug } }),
})

function RouteComponent() {
  return <div>Hello "/_storefront/products/$slug"!</div>
}
