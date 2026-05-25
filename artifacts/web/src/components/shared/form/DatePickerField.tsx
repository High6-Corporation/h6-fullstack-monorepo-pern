
import { useState } from "react"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DatePickerFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the date picker */
  label: string
  /** Optional description rendered below the date picker */
  description?: string
  /** Placeholder text when no date is selected (default: "Pick a date") */
  placeholder?: string
  /** Disable the date picker */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
  /** date-fns format string for display (default: "PPP") */
  dateFormat?: string
}

/**
 * Reusable date picker field that wraps react-hook-form's Controller with the
 * shadcn Field + Popover + Calendar + FieldError pattern.
 *
 * The form value is a `Date | undefined`. The displayed text uses date-fns
 * `format()` for localization-friendly output.
 *
 * Usage:
 *   <DatePickerField
 *     control={control}
 *     name="publishedAt"
 *     label="Published At"
 *   />
 *
 *   <DatePickerField
 *     control={control}
 *     name="startDate"
 *     label="Start Date"
 *     placeholder="Select start date"
 *     dateFormat="yyyy-MM-dd"
 *     required
 *   />
 */
export function DatePickerField<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date",
  disabled = false,
  required = false,
  dateFormat = "PPP",
}: DatePickerFieldProps<TFieldValues>) {
  const [open, setOpen] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel htmlFor={name}>
            {label}
            {!required && (
              <Badge variant="outline" className="text-muted-foreground">
                Optional
              </Badge>
            )}
          </FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                disabled={disabled}
                aria-invalid={!!fieldState.error}
                className={cn(
                  "w-full justify-start text-left font-normal shadow-xs",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {field.value ? format(field.value, dateFormat) : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  setOpen(false)
                }}
                defaultMonth={field.value}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}
