import { SelectCatgeory } from '@/db/types'
import { ColumnDef } from '@tanstack/react-table'
export const columns: ColumnDef<SelectCatgeory>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'subcategories',
    header: 'Subcategories',
  },
]
