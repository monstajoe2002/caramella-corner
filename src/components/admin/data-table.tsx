import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { FileIcon, PlusIcon, Search } from 'lucide-react'
import { Link, type ToOptions } from '@tanstack/react-router'
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import pluralize from 'pluralize'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  newEntryTo?: ToOptions['to']
  filteredCol?: string
  label?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  newEntryTo,
  filteredCol = 'name',
  label,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
  })
  const filteredRows = table.getFilteredRowModel().rows
  return (
    <>
      <div className="flex items-center py-4">
        <InputGroup className="w-fit">
          <InputGroupInput
            placeholder="Search"
            value={
              (table.getColumn(filteredCol)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(filteredCol)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="overflow-hidden rounded-md border ">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileIcon />
                      </EmptyMedia>
                      <EmptyTitle>No {pluralize(label!)}</EmptyTitle>
                      <EmptyDescription>
                        This is where you can add {pluralize(label!)} to
                        organize your products. Click{' '}
                        <strong>"Create {label}"</strong> below to get started.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button asChild>
                        <Link to={newEntryTo}>Create {label}</Link>
                      </Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}

            {newEntryTo && data.length > 0 && filteredRows.length > 0 ? (
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
    </>
  )
}
