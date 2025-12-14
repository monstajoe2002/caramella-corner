import { DataTable } from '@/components/admin/data-table'
import { OrderWithCustomer } from '@/db/types'
import { columns as orderCols } from '@/features/admin/orders/components/columns'
import { getOrders } from '@/features/admin/orders/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders/')({
  component: RouteComponent,
  loader: () => getOrders(),
})

function RouteComponent() {
  const data: OrderWithCustomer[] = Route.useLoaderData()
  return (
    <div className="space-y-6 py-6">
      <div>
        <h1>Orders</h1>
        <p className="text-muted-foreground mt-4">
          Manage and view all customer orders
        </p>
      </div>
      <DataTable columns={orderCols} data={data} filteredCol="orderNumber" />
    </div>
  )
}
