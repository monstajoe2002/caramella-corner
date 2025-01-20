"use client";
import CategoryForm from "@/components/categories/category-form";
import { columns } from "@/components/categories/columns";
import { DataTable } from "@/components/data-table";
import { Category } from "@caramella-corner/database/types/index";
import { useQuery } from "@tanstack/react-query";

export default function CategoriesPage() {
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      return res.json();
    },
  });
  return (
    <div>
      <h1>Categories</h1>
      <div className="mt-10">
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={data ?? []}
          addButtonLabel="Create Category"
          showAddButton
          addButtonType="dialog"
        >
          {/* Create category form content goes here */}
          <CategoryForm />
        </DataTable>
      </div>
    </div>
  );
}
