
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<
  React.ComponentProps<"input">,
  "name" | "id" | "value" | "onChange" | "onBlur"
> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the input */
  label: string
  /** Optional description rendered inline with the label */
  description?: string
}

/**
 * Reusable form field that wraps react-hook-form's Controller with the
 * shadcn Field + Input + FieldError pattern.
 *
 * Usage:
 *   <InputField
 *     control={control}
 *     name="firstName"
 *     label="First Name"
 *   />
 *
 *   <InputField
 *     control={control}
 *     name="email"
 *     label="Email"
 *     type="email"
 *     autoComplete="email"
 *     required
 *   />
 */
export function InputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  type = "text",
  placeholder,
  disabled = false,
  ...inputProps
}: InputFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel htmlFor={name}>
            {label}
            {!inputProps?.required && (
              <Badge variant="outline" className="text-muted-foreground">
                Optional
              </Badge>
            )}
          </FieldLabel>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            className={cn("shadow-xs", inputProps.className)}
            {...inputProps}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}
