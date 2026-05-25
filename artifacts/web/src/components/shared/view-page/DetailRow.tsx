import { cn } from "@/lib/utils"

interface DetailRowProps {
  label: string
  value: React.ReactNode
  className?: string
}

export function DetailRow({ label, value, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-b py-3 last:border-b-0 sm:flex-row sm:gap-4",
        className
      )}
    >
      <dt className="min-w-32 text-sm font-medium text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}
