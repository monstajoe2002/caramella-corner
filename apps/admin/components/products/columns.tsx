"use client";

import { ColumnDef } from "@tanstack/react-table";

// TODO: define the type for the data

export const columns: ColumnDef<{
  name: string;
  quantity: number;
  active: boolean;
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell(props) {
      return <span>{props.row.getValue("active") ? "Yes" : "No"}</span>;
    },
  },
];
