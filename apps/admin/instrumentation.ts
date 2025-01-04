import { connectToDatabase } from "@caramella-corner/database/lib/connection";

export async function register() {
  await connectToDatabase();
}
