import { getOrders } from "@caramella-corner/database/admin/orders";
export async function GET() {
  try {
    const ordersData = await getOrders();
    return new Response(JSON.stringify(ordersData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
