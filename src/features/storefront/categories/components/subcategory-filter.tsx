import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Subcategory {
  id: string
  name: string
  slug: string
}

interface SubcategoryFilterProps {
  subcategories: Subcategory[]
  selectedSubcategory?: string
  onSubcategoryChange: (subcategoryId: string | null) => void
}

export default function SubcategoryFilter({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
}: SubcategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter by Subcategory</h3>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedSubcategory ? 'default' : 'secondary'}
          className={cn(
            'cursor-pointer transition-colors',
            !selectedSubcategory
              ? 'bg-primary text-primary-foreground hover:bg-primary/80'
              : 'hover:bg-secondary/80',
          )}
          onClick={() => onSubcategoryChange(null)}
        >
          All
        </Badge>
        {subcategories.map((subcategory) => (
          <Badge
            key={subcategory.id}
            variant={
              selectedSubcategory === subcategory.id ? 'default' : 'secondary'
            }
            className={cn(
              'cursor-pointer transition-colors',
              selectedSubcategory === subcategory.id
                ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                : 'hover:bg-secondary/80',
            )}
            onClick={() => onSubcategoryChange(subcategory.id)}
          >
            {subcategory.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
