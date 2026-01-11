import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="border rounded-md p-4">
      <Skeleton className="h-40 mb-4 rounded-md" />
      <Skeleton className="h-6 rounded mb-2 w-3/4" />
      <Skeleton className="h-4 rounded w-1/2" />
    </div>
  )
}
