
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<
  React.ComponentProps<"textarea">,
  "name" | "id" | "value" | "onChange" | "onBlur"
> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the textarea */
  label: string
  /** Optional description rendered below the textarea */
  description?: string
}

/**
 * Reusable textarea field that wraps react-hook-form's Controller with the
 * shadcn Field + Textarea + FieldError pattern.
 *
 * Usage:
 *   <TextareaField
 *     control={control}
 *     name="body"
 *     label="Body"
 *     rows={6}
 *   />
 *
 *   <TextareaField
 *     control={control}
 *     name="description"
 *     label="Description"
 *     placeholder="Enter a detailed description"
 *     rows={4}
 *   />
 */
export function TextareaField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  rows = 3,
  placeholder,
  disabled = false,
  ...textareaProps
}: TextareaFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel htmlFor={name}>
            {label}
            {!textareaProps.required && (
              <Badge variant="outline" className="text-muted-foreground">
                Optional
              </Badge>
            )}
          </FieldLabel>
          <Textarea
            id={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            className={cn(
              "field-sizing-content shadow-xs",
              textareaProps?.className
            )}
            {...textareaProps}
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
