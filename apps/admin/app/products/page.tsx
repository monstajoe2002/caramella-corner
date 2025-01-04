import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/data-table";

export default async function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <div className="mt-10">
        <DataTable
          columns={columns}
          data={[]}
          showAddButton
          addButtonLabel="Add Product"
          addButtonType="link"
          addButtonHref="/products/new"
        />
      </div>
    </div>
  );
}
