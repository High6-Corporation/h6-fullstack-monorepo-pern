
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod/v4"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { changePasswordAction } from "@/actions/account-actions"
import type { SecuritySettings } from "@/types/account-types"
import { InputField } from "@/components/shared/form/InputField"

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SecurityFormValues = z.infer<typeof securitySchema>

function formatTimestamp(iso: string | null): string {
  if (!iso) return "Never"
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return "Unknown"
  }
}

export function SecuritySettingsForm({
  initialValues,
}: {
  initialValues: SecuritySettings
}) {
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema as never),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: SecurityFormValues) {
    const result = await changePasswordAction(data)

    if (!result.success) {
      if (result.errors) {
        for (const [name, messages] of Object.entries(result.errors)) {
          form.setError(name as keyof SecurityFormValues, {
            message: messages?.[0],
          })
        }
      }
      toast.error(result.error ?? "Failed to update password")
      return
    }

    form.reset()
    toast.success("Password updated successfully")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="security-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Last changed</FieldLabel>
              <FieldDescription>
                {formatTimestamp(initialValues.passwordUpdatedAt ?? null)}
              </FieldDescription>
            </Field>
            <InputField
              control={form.control}
              name="currentPassword"
              label="Current Password"
              type="password"
              autoComplete="current-password"
              required
            />
            <InputField
              control={form.control}
              name="newPassword"
              label="New Password"
              type="password"
              autoComplete="new-password"
              required
            />
            <InputField
              control={form.control}
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              required
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="security-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </CardFooter>
    </Card>
  )
}
