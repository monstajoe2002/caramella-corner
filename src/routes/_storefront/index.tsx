import { createFileRoute } from '@tanstack/react-router'
import FeaturedProductsCarousel from '@/components/storefront/featured-products-carousel'
import { seo } from '@/lib/utils'
import { getActiveProducts } from '@/features/storefront/products/data'
import { useRouterState } from '@tanstack/react-router'
import { ProductCardSkeleton } from '@/features/storefront/products/components/product-card-skeleton'

export const Route = createFileRoute('/_storefront/')({
  component: App,
  loader: () => getActiveProducts({ data: { limit: 5 } }),
  head: () => ({
    meta: seo({
      title: 'Home | Caramella Corner',
      description:
        'Welcome to Caramella Corner, your essential online shopping destination for all your clothing and accessories needs.',
      keywords:
        'Caramella Corner, online shopping, clothing, accessories, fashion, shopping',
    }),
  }),
})

function App() {
  const products = Route.useLoaderData()
  const { isLoading } = useRouterState()

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="mb-4">Welcome to Caramella Corner</h1>
        <p className="text-muted-foreground">
          Your one-stop shop for all your needs
        </p>
      </header>

      <section className="mb-10">
        <h2>Featured Products</h2>
        {/* Show skeletons while loading, else show carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...products.keys()].map((key) => (
              <ProductCardSkeleton key={key} />
            ))}
          </div>
        ) : (
          <FeaturedProductsCarousel products={products} />
        )}
      </section>
    </div>
  )
}
