
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"

interface SwitchFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed next to the switch */
  label: string
  /** Optional description rendered below the label */
  description?: string
  /** Disable the switch */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
  /** Switch size (default: "default") */
  size?: "sm" | "default"
}

/**
 * Reusable switch field that wraps react-hook-form's Controller with the
 * shadcn Field + Switch + FieldError pattern.
 *
 * Use `SwitchField` for boolean toggles/preferences
 * (e.g., "Enable notifications", "Dark mode").
 * Use `CheckboxField` for boolean consent/acknowledgment fields
 * (e.g., "I agree to the terms").
 *
 * The form value is a `boolean`.
 *
 * Usage:
 *   <SwitchField
 *     control={control}
 *     name="emailNotifications"
 *     label="Email Notifications"
 *     description="Receive email updates about your account."
 *   />
 *
 *   <SwitchField
 *     control={control}
 *     name="isActive"
 *     label="Active"
 *     size="sm"
 *   />
 */
export function SwitchField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  required = false,
  size = "default",
}: SwitchFieldProps<TFieldValues>) {
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
          <Switch
            id={name}
            checked={field.value ?? false}
            onCheckedChange={(checked) => field.onChange(checked)}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            size={size}
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
