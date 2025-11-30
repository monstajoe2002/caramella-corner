import CategoryForm from '@/features/admin/categories/components/form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/categories/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>New Category</h1>
      <CategoryForm />
    </div>
  )
}
