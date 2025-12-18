import { DataTable } from '@/components/admin/data-table'
import { LoadingTableSkeleton } from '@/components/admin/loading-table-skeleton'
import { ProductWithVariants } from '@/db/types'
import { columns as productCols } from '@/features/admin/products/components/columns'
import { getProductsWithVariants } from '@/features/admin/products/data'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/admin/products/')({
  component: RouteComponent,
  // loader: () => getProductsWithVariants(),
})

function RouteComponent() {
  // const data: ProductWithVariants[] = Route.useLoaderData()
  const getProductsFn = useServerFn(getProductsWithVariants)
  const { data, isLoading } = useQuery({
    queryKey: ['productsWithVariants'],
    queryFn: getProductsFn as () => Promise<ProductWithVariants[] | undefined>,
  })
  return (
    <div>
      <h1>Products</h1>
      {isLoading ? (
        <LoadingTableSkeleton />
      ) : (
        <DataTable
          label={'product'}
          newEntryTo={'/admin/products/new'}
          columns={productCols}
          data={data || []}
        />
      )}
    </div>
  )
}
