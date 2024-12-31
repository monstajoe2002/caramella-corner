import { DataTable } from "@/components/data-table";
import { columns } from "@/components/orders/columns";
import { faker } from "@faker-js/faker";

export default function OrdersPage() {
  const data = new Array(5).fill(null).map(() => ({
    name: faker.commerce.product(),
    quantity: faker.number.int({
      min: 1,
      max: 10,
    }),
    orderDate: faker.date.recent({ days: 10 }).toLocaleDateString(),
    status: faker.helpers.arrayElement(["Pending", "Shipped", "Delivered"]),
  }));
  return (
    <div>
      <h1>Products</h1>
      <div className="mt-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
