import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <div className="mt-10">
        <DataTable columns={columns} />
      </div>
    </div>
  );
}
