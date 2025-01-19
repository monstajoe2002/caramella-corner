import { columns } from "@/components/categories/columns";
import { DataTable } from "@/components/data-table";

export default function CategoriesPage() {
  return (
    <div>
      <h1>Categories</h1>
      <div className="mt-10">
        <DataTable
          columns={columns}
          data={[]}
          addButtonLabel="Create Category"
          showAddButton
          addButtonType="dialog"
        >
          {/* Create category dialog content goes here */}
        </DataTable>
      </div>
    </div>
  );
}
