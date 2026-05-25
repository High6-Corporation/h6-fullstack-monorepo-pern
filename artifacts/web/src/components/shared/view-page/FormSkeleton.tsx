import { Skeleton } from "@/components/ui/skeleton"

interface FormSkeletonProps {
  /** Number of form field rows to show */
  fields?: number
  /** Show a submit button skeleton */
  submit?: boolean
}

export function FormSkeleton({ fields = 4, submit = true }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      {submit && <Skeleton className="h-9 w-28" />}
    </div>
  )
}
