import { getCategoryById } from '@/features/admin/categories/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/categories/$id/edit')({
  component: RouteComponent,
  loader: async ({ params }) => getCategoryById({ data: params }),
})

function RouteComponent() {
  const category = Route.useLoaderData()
  return <div>{JSON.stringify(category, null, 2)} </div>
}
