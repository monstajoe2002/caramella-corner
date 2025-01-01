import { columns } from "@/components/categories/columns";
import { DataTable } from "@/components/data-table";
import { faker } from "@faker-js/faker";

export default function CategoriesPage() {
  const data = [
    {
      name: faker.commerce.department(),
      subcategories: faker.helpers.uniqueArray(faker.commerce.department, 5),
    },
    {
      name: faker.commerce.department(),
      subcategories: faker.helpers.uniqueArray(faker.commerce.department, 5),
    },
  ];
  return (
    <div>
      <h1>Categories</h1>
      <div className="mt-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
