import ProductCard from '@/features/storefront/products/components/card'
import { getActiveProducts } from '@/features/storefront/products/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/products/')({
  component: RouteComponent,
  loader: () => getActiveProducts(),
})

function RouteComponent() {
  const products = Route.useLoaderData()
  return (
    <div>
      <h1 className="text-start">Products</h1>
      <p>Browse all our exclusive products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4">
        {products.map((p) => {
          const [thumbnail] = p.images
          return (
            <ProductCard
              key={p.id}
              {...p}
              category={p.category?.name!}
              quantity={p.quantity || 0}
              imageUrl={thumbnail.ikThumbnailUrl}
            />
          )
        })}
      </div>
    </div>
  )
}
