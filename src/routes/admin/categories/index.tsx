import { columns as categoryCols } from '@/features/admin/categories/components/columns'
import { DataTable } from '@/components/admin/data-table'
import { CategoryWithSubcategories } from '@/db/types'
import { createFileRoute } from '@tanstack/react-router'
import { getCategoriesWithSubcategories } from '@/features/admin/categories/data'

export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  loader: () => getCategoriesWithSubcategories(),
})

function RouteComponent() {
  const data: CategoryWithSubcategories[] = Route.useLoaderData()
  return (
    <div>
      <h1>Categories</h1>
      <DataTable
        newEntryTo={'/admin/categories/new'}
        columns={categoryCols}
        data={data}
      />
    </div>
  )
}
