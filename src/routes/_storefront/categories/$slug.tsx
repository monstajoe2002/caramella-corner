import ProductCard from '@/features/storefront/products/components/card'
import { getProductsByCategorySlug } from '@/features/admin/products/data'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import SubcategoryFilter from '@/features/storefront/categories/components/subcategory-filter'

export const Route = createFileRoute('/_storefront/categories/$slug')({
  component: RouteComponent,
  loader: ({ params }) => getProductsByCategorySlug({ data: params }),
})

function RouteComponent() {
  const products = Route.useLoaderData()
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  // Extract unique subcategories from products
  const subcategories = useMemo(() => {
    const subcategoryMap = new Map()
    products.forEach((product) => {
      if (product.subcategory) {
        subcategoryMap.set(product.subcategory.id, {
          id: product.subcategory.id,
          name: product.subcategory.name,
          slug: product.subcategory.slug,
        })
      }
    })
    return Array.from(subcategoryMap.values())
  }, [products])
  // Filter products by selected subcategory
  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory) return products
    return products.filter(
      (product) => product.subcategory?.id === selectedSubcategory,
    )
  }, [products, selectedSubcategory])
  return (
    <div>
      {subcategories.length > 0 && (
        <SubcategoryFilter
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={setSelectedSubcategory}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
        {filteredProducts.map((p) => {
          const [thumbnail] = p.images
          return (
            <ProductCard
              key={p.id}
              {...p}
              category={p.category?.name!}
              quantity={p.quantity || 0}
              imageUrl={thumbnail.ikThumbnailUrl}
            />
          )
        })}
      </div>
    </div>
  )
}
