import OrderItems from '@/features/admin/orders/components/order-items'
import { getOrderById } from '@/features/admin/orders/db'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders/$id')({
  component: RouteComponent,
  loader: async ({ params }) => getOrderById(params.id),
})

function RouteComponent() {
  const order = Route.useLoaderData()
  return (
    <div>
      <h1 className="text-start">Order Details</h1>
      <p className="text-start text-muted-foreground">
        View the details of the order with the ID: {Route.useParams().id}
      </p>
      <OrderItems orderItems={order?.orderItems || []} />
    </div>
  )
}
