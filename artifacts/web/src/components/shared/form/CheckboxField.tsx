
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"

interface CheckboxFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed next to the checkbox */
  label: string
  /** Optional description rendered below the label */
  description?: string
  /** Disable the checkbox */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
}

/**
 * Reusable checkbox field that wraps react-hook-form's Controller with the
 * shadcn Field + Checkbox + FieldError pattern.
 *
 * Use `CheckboxField` for boolean consent/acknowledgment fields
 * (e.g., "I agree to the terms").
 * Use `SwitchField` for boolean toggles/preferences (e.g., "Enable notifications").
 *
 * The form value is a `boolean`.
 *
 * Usage:
 *   <CheckboxField
 *     control={control}
 *     name="agreeToTerms"
 *     label="I agree to the terms and conditions"
 *     required
 *   />
 *
 *   <CheckboxField
 *     control={control}
 *     name="isFeatured"
 *     label="Featured"
 *     description="Featured items appear on the homepage."
 *   />
 */
export function CheckboxField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  required = false,
}: CheckboxFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={!!fieldState.error}
          orientation="horizontal"
          className="items-start gap-3"
        >
          <Checkbox
            id={name}
            checked={field.value ?? false}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            className="mt-0.5 shadow-xs"
          />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor={name} className="font-normal">
              {label}
              {!required && (
                <Badge variant="outline" className="text-muted-foreground">
                  Optional
                </Badge>
              )}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </div>
        </Field>
      )}
    />
  )
}
