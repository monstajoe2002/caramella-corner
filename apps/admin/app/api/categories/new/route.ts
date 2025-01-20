import { createCategory } from "@caramella-corner/database/admin/categories";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = await createCategory(body);
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
