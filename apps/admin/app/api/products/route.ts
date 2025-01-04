import { getProducts } from "@caramella-corner/database/admin/products";

export async function GET() {
  try {
    const products = await getProducts();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
