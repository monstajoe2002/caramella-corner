import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default function Page() {
  return (
    <main>
      <h1>Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <DashboardCard title="Total Sales">
          <p className="text-2xl font-bold">$45,231.89</p>
        </DashboardCard>
        <DashboardCard title="Total Sales">
          <p className="text-2xl font-bold">$45,231.89</p>
        </DashboardCard>
        <DashboardCard title="Total Sales">
          <p className="text-2xl font-bold">$45,231.89</p>
        </DashboardCard>
      </div>
    </main>
  );
}
