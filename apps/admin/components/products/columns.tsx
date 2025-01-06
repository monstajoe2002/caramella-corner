"use client";

import { Product } from "@caramella-corner/database/lib/types";
import { Button } from "@caramella-corner/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@caramella-corner/ui/components/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

// TODO: define the type for the data

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },

  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      return <span>{row.getValue("active") ? "Yes" : "No"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/products/${row.original.slug}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/20">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
