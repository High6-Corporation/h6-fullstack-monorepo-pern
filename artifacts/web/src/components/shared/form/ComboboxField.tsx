
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

interface ComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string | number,
> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the combobox */
  label: string
  /** Optional description rendered below the combobox */
  description?: string
  /** Placeholder text when no value is selected (default: "Search...") */
  placeholder?: string
  /** Array of options to display */
  options: ComboboxOption[]
  /** Disable the combobox */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
  /** Transform option value before setting (default: identity) */
  transformValue?: (value: string) => TFieldValue
}

/**
 * Reusable combobox field that wraps react-hook-form's Controller with the
 * shadcn Field + Combobox + FieldError pattern.
 *
 * Use `ComboboxField` for searchable selects with 10+ options.
 * Use `SelectField` for short lists where search isn't needed.
 *
 * Usage:
 *   <ComboboxField
 *     control={control}
 *     name="userId"
 *     label="Author"
 *     placeholder="Search users..."
 *     options={users.map((u) => ({ value: String(u.id), label: u.name }))}
 *     transformValue={(v) => Number(v)}
 *   />
 *
 *   With string values:
 *   <ComboboxField
 *     control={control}
 *     name="category"
 *     label="Category"
 *     placeholder="Search categories..."
 *     options={categories}
 *     required
 *   />
 */
export function ComboboxField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string,
>({
  control,
  name,
  label,
  description,
  placeholder = "Search...",
  options,
  disabled = false,
  required = false,
  transformValue = (v) => v as unknown as TFieldValue,
}: ComboboxFieldProps<TFieldValues, TFieldValue>) {
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
            <Combobox
              items={options}
              value={
                stringValue
                  ? (options.find((o) => o.value === stringValue) ?? null)
                  : null
              }
              onValueChange={(v) => {
                if (v != null && typeof v === "object" && "value" in v) {
                  field.onChange(transformValue(String(v.value)))
                }
              }}
              disabled={disabled}
            >
              <ComboboxInput
                id={name}
                placeholder={placeholder}
                aria-invalid={!!fieldState.error}
                className={cn("shadow-xs")}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>No results found.</ComboboxEmpty>
                <ComboboxList
                  children={
                    ((item: ComboboxOption) => (
                      <ComboboxItem
                        key={item.value}
                        value={item}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </ComboboxItem>
                    )) as unknown as React.ReactNode
                  }
                />
              </ComboboxContent>
            </Combobox>
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
