"use client";

import { ColumnDef } from "@tanstack/react-table";

// TODO: define the type for the data

export const columns: ColumnDef<{
  name: string;
  quantity: number;
  orderDate: string;
  status: string;
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "quantity",
    header: () => <span className="hidden md:table-cell">Quantity</span>,
    cell: ({ row }) => (
      <span className="hidden md:table-cell">{row.getValue("quantity")}</span>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
