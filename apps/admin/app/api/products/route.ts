import { connectToDatabase } from "@caramella-corner/database/lib/connection";
import { ProductModel } from "@caramella-corner/database/models/product";

export async function GET() {
  try {
    await connectToDatabase(process.env.MONGO_URI!);
    const products = await ProductModel.find();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
