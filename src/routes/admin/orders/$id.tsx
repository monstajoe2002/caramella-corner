import OrderItems from '@/features/admin/orders/components/order-items'
import { getOrderById } from '@/features/admin/orders/data'
import { OrderItemWithVariantAndProduct } from '@/db/types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const order = await getOrderById({ data: { id: params.id } })
    if (!order) {
      throw new Error('Order not found')
    }
    return order
  },
})

function RouteComponent() {
  const order = Route.useLoaderData()

  // Filter orderItems to match the type: only include items with non-null variant and product
  const validOrderItems: OrderItemWithVariantAndProduct[] = (
    order.orderItems || []
  ).filter(
    (item): item is OrderItemWithVariantAndProduct =>
      item.variant !== null && item.variant.product !== null,
  ) as OrderItemWithVariantAndProduct[]

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-start">Order Details</h1>
        <p className="text-start text-muted-foreground">
          View the details of the order with the number: {order.orderNumber}
        </p>
      </div>
      <OrderItems orderItems={validOrderItems} />
    </div>
  )
}
