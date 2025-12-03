import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/categories/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/categories/edit/$id"!</div>
}
