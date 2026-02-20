import { DataTable } from '@/components/admin/data-table'
import { columns as paymentCols } from '@/features/admin/payments/components/columns'
import { getPayments } from '@/features/admin/payments/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/payments/')({
  component: RouteComponent,
  loader: () => getPayments(),
})

function RouteComponent() {
  const data = Route.useLoaderData()
  return (
    <div className="space-y-6 py-6">
      <div>
        <h1>Payments</h1>
        <p className="text-muted-foreground mt-4">
          View and manage all payment transactions
        </p>
      </div>
      <DataTable
        columns={paymentCols}
        data={data}
        filteredCol="id"
        label="payment"
      />
    </div>
  )
}
