"use client";

import { Order } from "@caramella-corner/database/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Order>[] = [
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
