import ProductCard from '@/components/storefront/products/card'
import { getProductsWithVariants } from '@/features/admin/products/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/products/')({
  component: RouteComponent,
  loader: () => getProductsWithVariants,
})

function RouteComponent() {
  return (
    <div>
      <h1>Products</h1>
      <p>Browse all our exclusive products</p>
      <ProductCard />
    </div>
  )
}
