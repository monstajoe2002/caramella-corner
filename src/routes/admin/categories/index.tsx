import { columns as categoryCols } from '@/components/admin/categories/columns'
import { DataTable } from '@/components/admin/data-table'
import { SelectCatgeory } from '@/db/types'
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
  const data: SelectCatgeory[] = Route.useLoaderData()
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
