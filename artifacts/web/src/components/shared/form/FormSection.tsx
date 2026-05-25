import { cn } from "@/lib/utils"
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <FieldSet className={cn("flex flex-col gap-4", className)}>
      <FieldLegend variant="label">{title}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup>{children}</FieldGroup>
    </FieldSet>
  )
}
