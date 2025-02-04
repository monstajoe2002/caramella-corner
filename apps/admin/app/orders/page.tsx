import { DataTable } from "@/components/data-table";
import { columns } from "@/components/orders/columns";

export default function OrdersPage() {
  return (
    <div>
      <h1>Products</h1>
      <div className="mt-10">
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
}
