
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string | number,
> extends Omit<
  React.ComponentProps<typeof SelectTrigger>,
  "name" | "id" | "value" | "onChange" | "onBlur" | "children" | "asChild"
> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the select */
  label: string
  /** Optional description rendered below the select */
  description?: string
  /** Placeholder text when no value is selected */
  placeholder?: string
  /** Array of options to display */
  options: SelectOption[]
  /** Disable the select */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
  /** Transform option value before setting (default: identity) */
  transformValue?: (value: string) => TFieldValue
}

/**
 * Reusable select field that wraps react-hook-form's Controller with the
 * shadcn Field + Select + FieldError pattern.
 *
 * Usage:
 *   <SelectField
 *     control={control}
 *     name="status"
 *     label="Status"
 *     placeholder="Select status"
 *     options={[
 *       { value: "active", label: "Active" },
 *       { value: "inactive", label: "Inactive" },
 *     ]}
 *   />
 *
 *   With custom value transformation:
 *   <SelectField
 *     control={control}
 *     name="userId"
 *     label="Author"
 *     placeholder="Select author"
 *     options={users.map((u) => ({ value: String(u.id), label: u.name }))}
 *     transformValue={(v) => Number(v)}
 *   />
 */
export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string,
>({
  control,
  name,
  label,
  description,
  placeholder = "Select an option",
  options,
  disabled = false,
  required = false,
  transformValue = (v) => v as unknown as TFieldValue,
  ...triggerProps
}: SelectFieldProps<TFieldValues, TFieldValue>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const stringValue =
          field.value != null ? String(field.value) : undefined

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
            <Select
              value={stringValue}
              onValueChange={(v) => field.onChange(transformValue(v))}
              disabled={disabled}
            >
              <SelectTrigger
                {...(triggerProps as Record<string, unknown>)}
                id={String(name)}
                aria-invalid={!!fieldState.error}
                className={cn("shadow-xs", triggerProps.className)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
