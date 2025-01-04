import { getProducts } from "@caramella-corner/database/admin/products";
import { connectToDatabase } from "@caramella-corner/database/lib/connection";

export async function GET() {
  try {
    await connectToDatabase(process.env.MONGO_URI!);
    const products = await getProducts();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
