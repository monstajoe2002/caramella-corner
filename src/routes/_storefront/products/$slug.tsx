import { getProductBySlug } from '@/features/admin/products/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/products/$slug')({
  component: RouteComponent,
  loader: ({ params: { slug } }) => getProductBySlug({ data: { slug } }),
})

function RouteComponent() {
  const product = Route.useLoaderData()
  return (
    <div>
      <h1 className="text-start">{product.name}</h1>
    </div>
  )
}
