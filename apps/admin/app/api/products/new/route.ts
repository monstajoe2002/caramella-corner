import { ProductModel } from "@caramella-corner/database/models/product";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await ProductModel.create(body);
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
