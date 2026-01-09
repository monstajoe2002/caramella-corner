import ProductCard from '@/features/storefront/products/components/card'
import {
  getActiveProducts,
  searchActiveProducts,
} from '@/features/storefront/products/data'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

const searchSchema = z.object({
  q: z.string().optional(),
})

export const Route = createFileRoute('/_storefront/products/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { q } }) => ({ query: q }),
  loader: async ({ deps: { query } }) => {
    if (query && query.trim()) {
      return await searchActiveProducts({ data: { query: query.trim() } })
    }
    return await getActiveProducts()
  },
})

function RouteComponent() {
  const products = Route.useLoaderData()
  const { q } = Route.useSearch()
  const hasSearchQuery = q && q.trim()

  return (
    <div>
      <h1 className="text-start">Products</h1>
      {hasSearchQuery ? (
        <p>
          Search results for &quot;{q}&quot; ({products.length} found)
        </p>
      ) : (
        <p>Browse all our exclusive products</p>
      )}
      {products.length === 0 && hasSearchQuery ? (
        <p className="text-muted-foreground">No products found matching your search.</p>
      ) : (
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
      )}
    </div>
  )
}
