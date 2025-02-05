"use client";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { formatNumber, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: totalRevenue } = useQuery({
    queryKey: ["total-revenue"],
    queryFn: async () => {
      const revenue = await fetch("/api/orders/revenue").then((res) =>
        res.json()
      );
      return revenue;
    },
  });
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const orders = await fetch("/api/orders").then((res) => res.json());
      return orders.count;
    },
  });
  return (
    <main>
      <h1>Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <DashboardCard title="Total Revenue">
          <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
        </DashboardCard>
        <DashboardCard title="New Customers">
          <p className="text-2xl font-bold">{formatNumber(150)}</p>
        </DashboardCard>
        <DashboardCard title="Total Orders">
          <p className="text-2xl font-bold">{formatNumber(orders)}</p>
        </DashboardCard>
      </div>
      <RecentOrdersTable />
    </main>
  );
}
