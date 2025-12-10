import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Edit Category</h1>
    </div>
  )
}
