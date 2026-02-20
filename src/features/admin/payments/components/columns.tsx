import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'

type PaymentWithOrder = Awaited<
  ReturnType<typeof import('../db').getPaymentsWithOrders>
>[number]

export const columns: ColumnDef<PaymentWithOrder>[] = [
  {
    accessorKey: 'id',
    header: 'Payment ID',
    cell: ({ row }) => {
      return <span className="font-mono text-sm">{row.original.id}</span>
    },
  },
  {
    id: 'order',
    header: 'Order',
    cell: ({ row }) => {
      const order = row.original.order
      if (!order) {
        return <span className="text-muted-foreground">N/A</span>
      }
      return (
        <Link
          to="/admin/orders/$id"
          params={{ id: order.id }}
          className="text-primary hover:underline font-mono"
        >
          {order.orderNumber}
        </Link>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.original.amount
      return (
        <span className="font-medium">
          {typeof amount === 'string' ? amount : Number(amount).toFixed(2)} EGP
        </span>
      )
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod
      return (
        <Badge variant="secondary">
          {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const variantMap: Record<
        string,
        'default' | 'secondary' | 'destructive' | 'outline'
      > = {
        pending: 'outline',
        completed: 'default',
        failed: 'destructive',
      }
      return (
        <Badge variant={variantMap[status] || 'outline'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const [date] = row.original.createdAt.toISOString().split('T')
      return <span className="text-muted-foreground">{date}</span>
    },
  },
]
