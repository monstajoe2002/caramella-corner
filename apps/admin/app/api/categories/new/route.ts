import { createCategory } from "@caramella-corner/database/admin/categories";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = await createCategory(body);
    revalidatePath("/categories");
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
