import ProductCard from '@/components/storefront/products/card'
import { getProductsByCategorySlug } from '@/features/admin/products/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/categories/$slug')({
  component: RouteComponent,
  loader: ({ params }) => getProductsByCategorySlug({ data: params }),
})

function RouteComponent() {
  const products = Route.useLoaderData()
  return (
    <div>
      {' '}
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
