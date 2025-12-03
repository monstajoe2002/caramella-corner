import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '../ui/button'
import { FileIcon, PlusIcon } from 'lucide-react'
import { Link, type ToOptions } from '@tanstack/react-router'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  newEntryTo?: ToOptions['to']
}

export function DataTable<TData, TValue>({
  columns,
  data,
  newEntryTo,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border mt-8">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileIcon />
                    </EmptyMedia>
                    <EmptyTitle>No categories</EmptyTitle>
                    <EmptyDescription>
                      This is where you can add categories to organize your
                      products. Click <strong>"Create Category"</strong> below
                      to get started.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <Link to="/admin/categories/new">Create Category</Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          )}

          {newEntryTo && data.length > 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Button variant={'link'} asChild className="w-full">
                  <Link to={newEntryTo}>
                    <PlusIcon />
                    <span>New</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
