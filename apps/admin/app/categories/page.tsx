import CategoryForm from "@/components/categories/category-form";
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
          {/* Create category form content goes here */}
          <CategoryForm />
        </DataTable>
      </div>
    </div>
  );
}
