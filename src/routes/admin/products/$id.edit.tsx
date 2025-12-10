import { ProductWithVariants } from '@/db/types'
import ProductForm from '@/features/admin/products/components/form'
import { getProductById } from '@/features/admin/products/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/$id/edit')({
  component: RouteComponent,
  loader: async ({ params }) => getProductById({ data: params }),
})

function RouteComponent() {
  const data: ProductWithVariants = Route.useLoaderData()
  return (
    <div>
      <h1>Edit Category</h1>
      <ProductForm data={data} />
    </div>
  )
}
