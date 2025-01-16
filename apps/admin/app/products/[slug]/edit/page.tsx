"use client";
import ProductForm from "@/components/products/product-form";
import { Product } from "@caramella-corner/database/lib/types";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: product } = useQuery<Product>({
    queryKey: ["products", slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      const data = await response.json();
      return data;
    },
  });
  return (
    <div>
      <h1>Edit an existing product</h1>
      <ProductForm product={product} intent="update" />
    </div>
  );
}
