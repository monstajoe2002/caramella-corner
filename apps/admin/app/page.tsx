"use client";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { formatNumber, formatPrice } from "@/lib/utils";
import { Skeleton } from "@caramella-corner/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: totalRevenue, isLoading: totalRevenueLoading } = useQuery({
    queryKey: ["total-revenue"],
    queryFn: async () => {
      const revenue = await fetch("/api/orders/revenue").then((res) =>
        res.json()
      );
      return revenue;
    },
  });
  const { data: orderCount, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const orders = await fetch("/api/orders").then((res) => res.json());
      return orders.count;
    },
  });
  const { data: customerCount, isLoading: customerCountLoading } = useQuery({
    queryKey: ["customer-count"],
    queryFn: async () => {
      const customerCount = await fetch("/api/customers").then((res) =>
        res.json()
      );
      return customerCount;
    },
  });
  return (
    <main>
      <h1>Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {totalRevenueLoading ? (
          <Skeleton className="w-full" />
        ) : (
          <DashboardCard title="Total Revenue">
            <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
          </DashboardCard>
        )}
        {customerCountLoading ? (
          <Skeleton className="w-full" />
        ) : (
          <DashboardCard title="New Customers">
            <p className="text-2xl font-bold">{formatNumber(customerCount)}</p>
          </DashboardCard>
        )}
        {ordersLoading ? (
          <Skeleton className="w-full" />
        ) : (
          <DashboardCard title="Recent Orders">
            <p className="text-2xl font-bold">{formatNumber(orderCount)}</p>
          </DashboardCard>
        )}
      </div>
      <RecentOrdersTable />
    </main>
  );
}
