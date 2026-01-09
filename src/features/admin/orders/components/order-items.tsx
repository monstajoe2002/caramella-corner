import { OrderItemWithVariantAndProduct } from '@/db/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatVariant } from '@/lib/utils'

type Props = {
  orderItems: OrderItemWithVariantAndProduct[]
}

const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EGP',
  }).format(numAmount)
}

export default function OrderItems({ orderItems }: Props) {
  if (orderItems.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No items found in this order.
      </div>
    )
  }

  const totalAmount = orderItems.reduce((sum, item) => {
    const price =
      typeof item.priceAtOrder === 'string'
        ? parseFloat(item.priceAtOrder)
        : item.priceAtOrder
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Items</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((orderItem) => {
              const unitPrice =
                typeof orderItem.priceAtOrder === 'string'
                  ? parseFloat(orderItem.priceAtOrder)
                  : orderItem.priceAtOrder
              const itemTotal = unitPrice * orderItem.quantity
              const variant = orderItem.variant
              const product = variant?.product

              return (
                <TableRow key={orderItem.id}>
                  <TableCell className="font-medium">
                    {product?.name || 'Unknown Product'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {variant && (
                        <>
                          <div className="text-sm font-mono text-muted-foreground">
                            SKU: {variant.sku}
                          </div>
                          {(variant.color || variant.size) && (
                            <div className="text-sm">
                              {formatVariant(
                                variant.color ?? undefined,
                                variant.size ?? undefined,
                              )}
                            </div>
                          )}
                        </>
                      )}
                      {!variant && (
                        <div className="text-sm text-muted-foreground">
                          No variant information
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {orderItem.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(itemTotal)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <div className="rounded-md border bg-muted/50 p-4 space-y-2 min-w-[200px]">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Items:</span>
            <span className="font-medium">
              {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Order Total: {formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
