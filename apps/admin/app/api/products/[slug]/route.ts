import {
  deleteProduct,
  getProductBySlug,
  updateProduct,
} from "@caramella-corner/database/admin/products";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return new Response("Product not found", { status: 404 });

  return new Response(JSON.stringify(product), { status: 200 });
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
  const product = await deleteProduct(slug);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return new Response(JSON.stringify(product), { status: 200 });
}
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
    return new Response("Body not provided", { status: 400 });
  }
  const updatedProduct = await updateProduct(slug, body);
  return new Response(JSON.stringify(updatedProduct), { status: 200 });
}
