import PaginationWithFirstAndLastPageNavigation from '@/features/storefront/products/components/pagination'
import z from 'zod'
import { seo } from '@/lib/utils'
import { createFileRoute, useRouterState } from '@tanstack/react-router'
import {
  getActiveProducts,
  searchActiveProducts,
  getActiveProductsCount,
  searchActiveProductsCount,
} from '@/features/storefront/products/data'
import ProductCard from '@/features/storefront/products/components/card'
import { ProductCardSkeleton } from '@/features/storefront/products/components/product-card-skeleton'

const ITEMS_PER_PAGE = 10

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
})

export const Route = createFileRoute('/_storefront/products/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { q, page } }) => ({ query: q, page }),
  loader: async ({ deps: { query, page } }) => {
    const currentPage = page ?? 1
    const limit = ITEMS_PER_PAGE
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    if (query && query.trim()) {
      const trimmedQuery = query.trim()
      const [products, totalCount] = await Promise.all([
        searchActiveProducts({
          data: {
            query: trimmedQuery,
            limit,
            offset,
          },
        }),
        searchActiveProductsCount({ data: { query: trimmedQuery } }),
      ])
      const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE)
      return {
        products,
        query: trimmedQuery,
        currentPage,
        totalPages: totalPages > 0 ? totalPages : 1,
      }
    }
    console.log('Offset: ', offset)
    const [products, totalCount] = await Promise.all([
      getActiveProducts({ data: { limit, offset } }),
      getActiveProductsCount(),
    ])
    const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE)

    return {
      products,
      currentPage,
      totalPages: totalPages > 0 ? totalPages : 1,
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
  const { products, currentPage = 1, totalPages = 1 } = Route.useLoaderData()
  const { q } = Route.useSearch()
  const { isLoading } = useRouterState()

  const hasSearchQuery = q && q.trim()

  const navigate = Route.useNavigate()

  function onPageChange(newPage: number) {
    navigate({ search: { q, page: newPage } })
  }

  const pagedProducts = products

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-between">
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grow items-stretch">
            {/* Show skeletons while loading, else show product cards */}
            {isLoading
              ? [...Array(ITEMS_PER_PAGE).keys()].map((key) => (
                  <ProductCardSkeleton key={key} />
                ))
              : pagedProducts.map((p) => {
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
          {totalPages > 1 && (
            <PaginationWithFirstAndLastPageNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
