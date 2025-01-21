import {
  deleteCategory,
  updateCategory,
} from "@caramella-corner/database/admin/categories";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await params;
  if (!slug) {
    return new Response("Slug not provided", { status: 400 });
  }
  const body = await req.json();
  if (!body) {
    return new Response("Category not provided", { status: 400 });
  }
  const updatedCategory = await updateCategory(slug, body);
  return new Response(JSON.stringify(updatedCategory), { status: 200 });
}
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await params;
  if (!slug) {
    return new Response("Slug not provided", { status: 400 });
  }
  const product = await deleteCategory(slug);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return new Response(JSON.stringify(product), { status: 200 });
}
