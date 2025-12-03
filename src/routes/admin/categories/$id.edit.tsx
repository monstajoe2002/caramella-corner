import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/categories/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <div>Hello: {id} </div>
}
