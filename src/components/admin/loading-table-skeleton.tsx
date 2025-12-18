import { Skeleton } from '../ui/skeleton'

export function LoadingTableSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      <Skeleton className="h-8 w-3/4 rounded-md" />
      <Skeleton className="h-6 w-full rounded-md" />
      <Skeleton className="h-6 w-full rounded-md" />
      <Skeleton className="h-6 w-full rounded-md" />
      <Skeleton className="h-6 w-full rounded-md" />
    </div>
  )
}
