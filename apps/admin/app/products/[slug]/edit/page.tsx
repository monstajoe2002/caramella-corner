import ProductForm from "@/components/products/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1>Edit an existing product</h1>
      <ProductForm productSlug={slug} />
    </div>
  );
}
