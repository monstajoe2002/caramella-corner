import ProductForm from '@/features/admin/products/components/form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>New Product</h1>
      <ProductForm />
    </div>
  )
}
