import OrderItems from '@/features/admin/orders/components/order-items'
import { getOrders } from '@/features/admin/orders/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders/$id')({
  component: RouteComponent,
  loader: () => getOrders(),
})

function RouteComponent() {
  const order = Route.useLoaderData().find(
    (order) => order.id === Route.useParams().id,
  )
  return (
    <div>
      <h1 className="text-start">Order Details</h1>
      <p className="text-start text-muted-foreground">
        View the details of the order with the number: {order?.orderNumber}
      </p>
      <OrderItems orderItems={order?.orderItems || []} />
    </div>
  )
}
