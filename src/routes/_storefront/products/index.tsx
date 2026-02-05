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
import CategoryFilter from '@/features/storefront/categories/components/category-filter'
import SubcategoryFilter from '@/features/storefront/categories/components/subcategory-filter'
import { getCategoriesWithSubcategories } from '@/features/admin/categories/data'

const ITEMS_PER_PAGE = 10

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
})

export const Route = createFileRoute('/_storefront/products/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { q, page, category, subcategory } }) => ({
    query: q,
    page,
    categoryId: category,
    subcategoryId: subcategory,
  }),
  loader: async ({ deps: { query, page, categoryId, subcategoryId } }) => {
    const currentPage = page ?? 1
    const limit = ITEMS_PER_PAGE
    const offset = (currentPage - 1) * ITEMS_PER_PAGE
    const filterParams = {
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined,
    }

    const [categoriesWithSubcategories, products, totalCount] =
      await Promise.all([
        getCategoriesWithSubcategories(),
        (async () => {
          if (query && query.trim()) {
            return searchActiveProducts({
              data: {
                query: query.trim(),
                limit,
                offset,
                ...filterParams,
              },
            })
          }
          return getActiveProducts({
            data: { limit, offset, ...filterParams },
          })
        })(),
        (async () => {
          if (query && query.trim()) {
            return searchActiveProductsCount({
              data: { query: query.trim(), ...filterParams },
            })
          }
          return getActiveProductsCount({ data: filterParams })
        })(),
      ])

    const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE)

    return {
      products,
      query: query?.trim(),
      currentPage,
      totalPages: totalPages > 0 ? totalPages : 1,
      categories: categoriesWithSubcategories,
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined,
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
  const {
    products,
    currentPage = 1,
    totalPages = 1,
    categories = [],
    categoryId,
    subcategoryId,
  } = Route.useLoaderData()
  const { q, category, subcategory } = Route.useSearch()
  const { isLoading } = useRouterState()

  const hasSearchQuery = q && q.trim()

  const navigate = Route.useNavigate()

  const selectedCategorySubcategories =
    categoryId != null
      ? (categories.find((c) => c.id === categoryId)?.subcategories ?? [])
      : []

  function onPageChange(newPage: number) {
    navigate({
      search: { q, page: newPage, category, subcategory },
    })
  }

  function onCategoryChange(newCategoryId: string) {
    navigate({
      search: {
        q,
        page: 1,
        category: newCategoryId || undefined,
        subcategory: undefined,
      },
    })
  }

  function onSubcategoryChange(newSubcategoryId: string) {
    navigate({
      search: {
        q,
        page: 1,
        category,
        subcategory: newSubcategoryId || undefined,
      },
    })
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
      <CategoryFilter
        categories={categories}
        selectedCategory={categoryId}
        onCategoryChange={onCategoryChange}
      />
      {categoryId != null && selectedCategorySubcategories.length > 0 && (
        <SubcategoryFilter
          subcategories={selectedCategorySubcategories}
          selectedSubcategory={subcategoryId}
          onSubcategoryChange={onSubcategoryChange}
        />
      )}
      {products.length === 0 && hasSearchQuery ? (
        <p className="text-muted-foreground">
          No products found matching your search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
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
