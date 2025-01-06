import { getProductBySlug } from "@caramella-corner/database/admin/products";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return new Response("Product not found", { status: 404 });

  return new Response(JSON.stringify(product), { status: 200 });
}
