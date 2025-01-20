import { getCategories } from "@caramella-corner/database/admin/categories";
export async function GET() {
  try {
    const categories = await getCategories();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
