import { Skeleton } from "@/components/ui/skeleton"

interface DataTableSkeletonProps {
  rows?: number
}

export function DataTableSkeleton({ rows = 5 }: DataTableSkeletonProps) {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[70px]" />
      </div>
      <div className="rounded-md border">
        <div className="space-y-2 p-4">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
      </div>
    </div>
  )
}
