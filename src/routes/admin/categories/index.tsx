import { columns as categoryCols } from '@/features/admin/categories/components/columns'
import { DataTable } from '@/components/admin/data-table'
import { Category } from '@/db/types'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
const getData = createServerFn().handler(async () => {
  return [
    {
      id: '728ed52f',
      name: 'test',
      slug: 'test',
      subcategories: ['a', 'b'],
    },
    {
      id: '728ed52f',
      name: 'test',
      slug: 'test',
      subcategories: ['a', 'b'],
    },
    // ...
  ]
})
export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  loader: () => getData(),
})

function RouteComponent() {
  const data: Category[] = Route.useLoaderData()
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
