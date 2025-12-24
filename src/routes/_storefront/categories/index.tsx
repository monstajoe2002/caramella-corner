import { buttonVariants } from '@/components/ui/button'
import { getCategoriesWithSubcategories } from '@/features/admin/categories/data'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_storefront/categories/')({
  component: RouteComponent,
  loader: () => getCategoriesWithSubcategories(),
})

function RouteComponent() {
  const categories = Route.useLoaderData()
  return (
    <div>
      <h1 className="text-start">Categories</h1>
      <p>Select a category to view its subcategories.</p>
      <div className="flex flex-col items-start gap-2 mt-4">
        {categories.map((c) => (
          <Link
            className={cn(
              buttonVariants({ variant: 'link' }),
              'text-primary p-0',
            )}
            to={'/categories/$slug'}
            params={{ slug: c.slug }}
            key={c.slug}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
