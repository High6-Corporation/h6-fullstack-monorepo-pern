import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: LucideIcon
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("shadow-xs", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="flex items-center text-xs text-muted-foreground">
            {trend && trendValue && (
              <>
                {trend === "up" && (
                  <TrendingUp className="mr-1 h-3 w-3 text-primary" />
                )}
                {trend === "down" && (
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    trend === "up" && "text-primary",
                    trend === "down" && "text-destructive"
                  )}
                >
                  {trendValue}
                </span>
                <span className="ml-1">{description}</span>
              </>
            )}
            {!trend && description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
