"use client";

import { Product } from "@caramella-corner/database/types";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@caramella-corner/ui/components/alert-dialog";
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
import { DeleteAlert } from "./delete-alert";
import Image from "next/image";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("image")}
          alt="Product Image"
          className="object-cover size-20"
          width={80}
          height={50}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt"))
        .toISOString()
        .split("T")
        .shift();
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
        <AlertDialog>
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
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/20">
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Delete confirmation dialog */}
          <DeleteAlert slug={row.original.slug} />
        </AlertDialog>
      );
    },
  },
];
