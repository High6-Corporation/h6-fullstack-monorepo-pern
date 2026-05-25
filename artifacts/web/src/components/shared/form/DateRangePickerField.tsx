
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

interface DateRange {
  from?: Date
  to?: Date
}

interface DateRangePickerFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the date range picker */
  label: string
  /** Optional description rendered below the date range picker */
  description?: string
  /** Placeholder text when no date is selected (default: "Pick a date range") */
  placeholder?: string
  /** Disable the date range picker */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
  /** date-fns format string for display (default: "PPP") */
  dateFormat?: string
}

function formatRange(range: DateRange, dateFormat: string): string {
  if (!range.from) return ""
  if (!range.to) return format(range.from, dateFormat)
  if (format(range.from, dateFormat) === format(range.to, dateFormat)) {
    return format(range.from, dateFormat)
  }
  return `${format(range.from, dateFormat)} – ${format(range.to, dateFormat)}`
}

/**
 * Reusable date range picker field that wraps react-hook-form's Controller
 * with the shadcn Field + Popover + Calendar (range mode) + FieldError pattern.
 *
 * The form value is `{ from?: Date, to?: Date } | undefined`.
 *
 * Usage:
 *   <DateRangePickerField
 *     control={control}
 *     name="dateRange"
 *     label="Date Range"
 *   />
 *
 *   <DateRangePickerField
 *     control={control}
 *     name="eventDates"
 *     label="Event Dates"
 *     placeholder="Select start and end dates"
 *     dateFormat="yyyy-MM-dd"
 *     required
 *   />
 */
export function DateRangePickerField<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date range",
  disabled = false,
  required = false,
  dateFormat = "PPP",
}: DateRangePickerFieldProps<TFieldValues>) {
  const [open, setOpen] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const range = (field.value as DateRange) ?? {}
        const displayText =
          range?.from || range?.to ? formatRange(range, dateFormat) : undefined

        return (
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
                    !displayText && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {displayText || placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  captionLayout="dropdown"
                  selected={
                    range?.from || range?.to
                      ? { from: range.from, to: range.to }
                      : undefined
                  }
                  onSelect={(selected) => {
                    field.onChange(selected ?? undefined)
                    // Close only when both from and to are selected
                    if (selected?.from && selected?.to) {
                      setOpen(false)
                    }
                  }}
                  defaultMonth={range?.from}
                  numberOfMonths={2}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )
      }}
    />
  )
}
