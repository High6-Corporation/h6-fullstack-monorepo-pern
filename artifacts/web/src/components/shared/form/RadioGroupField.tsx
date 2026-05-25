
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string | number,
> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the radio group */
  label: string
  /** Optional description rendered below the radio group */
  description?: string
  /** Array of options to display */
  options: RadioOption[]
  /** Disable the radio group */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
  /** Layout direction for options (default: "vertical") */
  direction?: "vertical" | "horizontal"
  /** Transform option value before setting (default: identity) */
  transformValue?: (value: string) => TFieldValue
}

/**
 * Reusable radio group field that wraps react-hook-form's Controller with the
 * shadcn Field + RadioGroup + FieldError pattern.
 *
 * Use `RadioGroupField` when users need to see all options at once
 * (e.g., priority: Low / Medium / High).
 * Use `SelectField` when options are too many to display as radios.
 *
 * Usage:
 *   <RadioGroupField
 *     control={control}
 *     name="priority"
 *     label="Priority"
 *     options={[
 *       { value: "low", label: "Low" },
 *       { value: "medium", label: "Medium" },
 *       { value: "high", label: "High" },
 *     ]}
 *     required
 *   />
 *
 *   Horizontal layout with number values:
 *   <RadioGroupField
 *     control={control}
 *     name="size"
 *     label="Size"
 *     direction="horizontal"
 *     options={[
 *       { value: "1", label: "Small" },
 *       { value: "2", label: "Medium" },
 *       { value: "3", label: "Large" },
 *     ]}
 *     transformValue={(v) => Number(v)}
 *   />
 */
export function RadioGroupField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string,
>({
  control,
  name,
  label,
  description,
  options,
  disabled = false,
  required = false,
  direction = "vertical",
  transformValue = (v) => v as unknown as TFieldValue,
}: RadioGroupFieldProps<TFieldValues, TFieldValue>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const stringValue =
          field.value != null ? String(field.value) : undefined

        return (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel>
              {label}
              {!required && (
                <Badge variant="outline" className="text-muted-foreground">
                  Optional
                </Badge>
              )}
            </FieldLabel>
            <RadioGroup
              value={stringValue}
              onValueChange={(v) => field.onChange(transformValue(v))}
              disabled={disabled}
              className={cn(
                direction === "horizontal" && "flex-row flex-wrap gap-4"
              )}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                    disabled={option.disabled}
                    className="shadow-xs"
                  />
                  <label
                    htmlFor={`${name}-${option.value}`}
                    className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
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
