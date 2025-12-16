import { CategoryWithSubcategories } from '@/db/types'
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
import { deleteCategory } from '../data'
import { ActionButton } from '@/components/ui/action-button'
import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
export const columns: ColumnDef<CategoryWithSubcategories>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <strong>{row.original.name}</strong>
    },
  },
  {
    accessorKey: 'subcategories',
    header: 'Subcategories',
    cell({ row }) {
      const formattedSubcats = row.original.subcategories
        .map((s) => s.name)
        .join(', ')
      return formattedSubcats
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const category = row.original
      const deleteCategoryFn = useServerFn(deleteCategory)
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
                <Link
                  params={{ id: category.id }}
                  to="/admin/categories/$id/edit"
                >
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
                permanently delete this category?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ActionButton
                action={async () => {
                  const res = await deleteCategoryFn({
                    data: { id: category.id },
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
