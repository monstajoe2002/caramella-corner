import { getMonthlyCustomers } from "@caramella-corner/database/admin/customers";

export async function GET() {
  try {
    const customerCount = await getMonthlyCustomers();
    return new Response(JSON.stringify(customerCount), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
