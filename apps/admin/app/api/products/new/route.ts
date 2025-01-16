import { createProduct } from "@caramella-corner/database/admin/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
