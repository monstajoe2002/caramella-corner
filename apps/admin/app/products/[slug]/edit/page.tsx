"use client";
import ProductForm from "@/components/products/product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div>
      <h1>Edit an existing product</h1>
      <ProductForm />
    </div>
  );
}
