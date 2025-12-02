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
      // const category = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PencilIcon />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
