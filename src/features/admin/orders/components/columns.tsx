import { ColumnDef } from '@tanstack/react-table'
import { OrderWithCustomer } from '@/db/types'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'

export const columns: ColumnDef<OrderWithCustomer>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order ID',
    cell: ({ row }) => {
      return <span className="font-mono">{row.original.orderNumber}</span>
    },
  },
  {
    accessorKey: 'customer',
    header: 'Customer Name',
    cell: ({ row }) => {
      return row.original.customer.name
    },
  },
  {
    id: 'viewItems',
    header: 'Order Items',
    cell: ({ row }) => {
      return (
        <Link
          to="/admin/orders/$id"
          params={{ id: row.original.id }}
          className="text-primary hover:underline"
        >
          View Items
        </Link>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const variantMap: Record<
        typeof status,
        'default' | 'secondary' | 'destructive' | 'outline'
      > = {
        pending: 'outline',
        delivered: 'default',
        canceled: 'destructive',
      }
      return (
        <Badge variant={variantMap[status] || 'outline'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
]
