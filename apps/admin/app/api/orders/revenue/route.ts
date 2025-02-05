import { getTotalRevenue } from "@caramella-corner/database/admin/orders";
export async function GET() {
  try {
    const revenueData = await getTotalRevenue();
    return new Response(JSON.stringify(revenueData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
