import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface FormActionsProps {
  children: React.ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-4 pt-4", className)}>
      {children}
    </div>
  )
}

interface SubmitButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  className?: string
}

export function SubmitButton({
  children,
  isLoading,
  className,
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isLoading} className={className}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

interface CancelButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function CancelButton({
  children,
  onClick,
  className,
}: CancelButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  )
}
