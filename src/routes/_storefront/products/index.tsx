import ProductCard from '@/features/storefront/products/components/card'
import {
  getActiveProducts,
  searchActiveProducts,
} from '@/features/storefront/products/data'
import { seo } from '@/lib/utils'
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
      return {
        products: await searchActiveProducts({ data: { query: query.trim() } }),
        query: query.trim(),
      }
    }
    return {
      products: await getActiveProducts(),
      query: undefined,
    }
  },
  head: ({ loaderData }) => {
    const { products = [], query } = loaderData || {
      products: [],
      query: undefined,
    }
    const hasSearchQuery = query && query.trim()
    const productCount = products.length

    const title = hasSearchQuery
      ? `Search Results for "${query}" | Caramella Corner`
      : 'Products | Caramella Corner'

    const description = hasSearchQuery
      ? `Found ${productCount} product${productCount !== 1 ? 's' : ''} matching "${query}". Browse our collection of high-quality products at Caramella Corner.`
      : 'Browse our exclusive collection of high-quality products at Caramella Corner. Discover unique items with great prices and fast shipping.'

    const keywords = hasSearchQuery
      ? `${query}, products, search, Caramella Corner, online store, shopping`
      : 'products, online store, shopping, Caramella Corner, exclusive items, quality products'

    // Use first product image if available
    const image =
      products.length > 0 && products[0]?.images?.[0]?.ikUrl
        ? products[0].images[0].ikUrl
        : undefined

    return {
      meta: seo({
        title,
        description,
        keywords,
        image,
      }),
    }
  },
})

function RouteComponent() {
  const { products } = Route.useLoaderData()
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
        <p className="text-muted-foreground">
          No products found matching your search.
        </p>
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
