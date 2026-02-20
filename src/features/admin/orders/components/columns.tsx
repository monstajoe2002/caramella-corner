import { ColumnDef } from '@tanstack/react-table'
import { OrderWithCustomer } from '@/db/types'
import { Badge } from '@/components/ui/badge'
import { Link, useRouter } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from 'lucide-react'
import { updateOrderStatus } from '@/features/admin/orders/data'
import { useState } from 'react'

function StatusCell({ order }: { order: OrderWithCustomer }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const status = order.status

  const variantMap: Record<
    typeof status,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    pending: 'outline',
    delivered: 'default',
    canceled: 'destructive',
  }

  const handleStatusChange = async (
    newStatus: 'pending' | 'delivered' | 'canceled',
  ) => {
    if (newStatus === status || isUpdating) return

    setIsUpdating(true)
    try {
      await updateOrderStatus({
        data: { orderId: order.id, status: newStatus },
      })
      router.invalidate()
    } catch (error) {
      console.error('Failed to update order status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent gap-1"
          disabled={isUpdating}
        >
          <Badge variant={variantMap[status] || 'outline'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <ChevronDownIcon className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => handleStatusChange('pending')}
          disabled={status === 'pending' || isUpdating}
        >
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('delivered')}
          disabled={status === 'delivered' || isUpdating}
        >
          Delivered
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('canceled')}
          disabled={status === 'canceled' || isUpdating}
          variant="destructive"
        >
          Canceled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
      return <StatusCell order={row.original} />
    },
  },
]
