import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  onCategoryChange: (categoryId: string) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedCategory ? 'default' : 'secondary'}
          className={cn(
            'cursor-pointer transition-colors',
            !selectedCategory
              ? 'bg-primary text-primary-foreground hover:bg-primary/80'
              : 'hover:bg-secondary/80',
          )}
          onClick={() => onCategoryChange('')}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'secondary'}
            className={cn(
              'cursor-pointer transition-colors',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                : 'hover:bg-secondary/80',
            )}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
