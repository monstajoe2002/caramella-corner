import { ProductWithVariants } from '@/db/types'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useServerFn } from '@tanstack/react-start'
import { deleteProduct } from '../data'
import { ActionButton } from '@/components/ui/action-button'
import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Image } from '@imagekit/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
export const columns: ColumnDef<ProductWithVariants>[] = [
  {
    id: 'thumbnail',
    cell: ({ row }) => {
      const [image] = row.original.images ?? []
      if (!image) return null
      return (
        <div className="object-cover">
          <Image width={75} height={75} src={image.ikThumbnailUrl} />
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <strong>{row.original.name}</strong>
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell({ row }) {
      return row.original.category.name
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell({ row }) {
      const [date] = row.original.createdAt.toISOString().split('T')
      return date
    },
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.active
      return (
        <Badge variant={isActive ? 'default' : 'outline'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const product = row.original
      const deleteProductFn = useServerFn(deleteProduct)
      const router = useRouter()

      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link params={{ id: product.id }} to="/admin/products/$id/edit">
                  <PencilIcon />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this product?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ActionButton
                action={async () => {
                  const res = await deleteProductFn({
                    data: { id: product.id },
                  })
                  setIsDialogOpen(false)
                  router.invalidate()
                  if (res.error) {
                    toast.error(res.message)
                  }
                  toast.success(res.message)
                  return res
                }}
              >
                Confirm
              </ActionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    },
  },
]
