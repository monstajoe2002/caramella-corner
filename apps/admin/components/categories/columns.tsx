"use client";
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
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@caramella-corner/ui/components/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DeleteAlert } from "../categories/delete-alert";
import { Category } from "@caramella-corner/database/types/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@caramella-corner/ui/components/dialog";
import CategoryForm from "./category-form";

export const columns: ColumnDef<Category>[] = [
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
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Dialog>
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
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm existingCategory={row.original} intent="update" />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
