import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/data-table";
import { faker } from "@faker-js/faker";
export default function ProductsPage() {
  const data = new Array(5).fill(null).map(() => ({
    name: faker.commerce.product(),
    quantity: faker.number.int({
      min: 1,
      max: 10,
    }),
    active: faker.datatype.boolean(),
  }));

  return (
    <div>
      <h1>Products</h1>
      <div className="mt-10">
        <DataTable
          columns={columns}
          data={data}
          showAddButton
          addButtonLabel="Add Product"
          addButtonType="link"
          addButtonHref="/products/new"
        />
      </div>
    </div>
  );
}
