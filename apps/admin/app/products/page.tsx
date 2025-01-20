"use client";
import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@caramella-corner/database/types";
import { TableSkeleton } from "@/components/table-skeleton";

export default function ProductsPage() {
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  return (
    <div>
      <h1>Products</h1>
      <div className="mt-10">
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={data ?? []}
          showAddButton
          addButtonLabel="Add Product"
          addButtonType="link"
          addButtonHref="/products/new"
        />
      </div>
    </div>
  );
}
