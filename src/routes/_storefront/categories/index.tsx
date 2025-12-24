import { getCategoriesWithSubcategories } from '@/features/admin/categories/data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/categories/')({
  component: RouteComponent,
  loader: () => getCategoriesWithSubcategories(),
})

function RouteComponent() {
  const categories = Route.useLoaderData()
  return (
    <div>
      <h1 className="text-start">Categories</h1>
      <p>Browse products by a specific category</p>
    </div>
  )
}
