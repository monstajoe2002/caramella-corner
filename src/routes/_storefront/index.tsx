import { createFileRoute } from '@tanstack/react-router'
import { getProductsWithVariants } from '@/features/admin/products/data'
import FeaturedProductsCarousel from '@/components/storefront/featured-products-carousel'

export const Route = createFileRoute('/_storefront/')({
  component: App,
  loader: () => getProductsWithVariants(),
})

function App() {
  const products = Route.useLoaderData()

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
        <FeaturedProductsCarousel products={products} />
      </section>
    </div>
  )
}
