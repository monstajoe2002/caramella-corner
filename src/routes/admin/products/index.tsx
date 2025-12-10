import { DataTable } from '@/components/admin/data-table'
import { ProductWithVariants } from '@/db/types'
import { columns as productCols } from '@/features/admin/products/components/columns'
import { getProductsWithVariants } from '@/features/admin/products/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/')({
  component: RouteComponent,
  loader: () => getProductsWithVariants(),
})

function RouteComponent() {
  const data: ProductWithVariants[] = Route.useLoaderData()
  return (
    <div>
      <h1>Products</h1>
      <DataTable
        newEntryTo={'/admin/products/new'}
        columns={productCols}
        data={data}
      />
    </div>
  )
}
