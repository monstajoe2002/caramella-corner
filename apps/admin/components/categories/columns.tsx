"use client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  name: string;
  subcategories: string[];
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "subcategories",
    header: "Subcategories",
    cell: ({ row }) => {
      const subcategories = row.getValue("subcategories") as string[];
      return (
        <span className="hidden md:table-cell">{subcategories.join(", ")}</span>
      );
    },
  },
];
