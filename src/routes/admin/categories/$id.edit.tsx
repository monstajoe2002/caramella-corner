import CategoryForm from '@/features/admin/categories/components/form'
import { getCategoryById } from '@/features/admin/categories/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/categories/$id/edit')({
  component: RouteComponent,
  loader: async ({ params }) => getCategoryById({ data: params }),
})

function RouteComponent() {
  const category = Route.useLoaderData()
  return (
    <div>
      <h1>Edit Category</h1>
      <CategoryForm data={category} />{' '}
    </div>
  )
}
