
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod/v4"
import { useQueryClient } from "@tanstack/react-query"
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
  FieldDescription,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateGeneralSettingsAction } from "@/actions/settings-actions"
import {
  uploadAppLogoAction,
  uploadAppIconAction,
} from "@/actions/upload-actions"
import { ImageUpload } from "@/components/shared/image-upload/ImageUpload"
import type { GeneralSettings } from "@/types/settings-types"
import { InputField } from "@/components/shared/form/InputField"
import { getGetSettingsGeneralQueryKey } from "@workspace/api-client-react/generated/settings/settings"

const generalSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  appLogo: z.string().nullable(),
  appIcon: z.string().nullable(),
  appUrl: z.string().url("App URL must be a valid URL"),
})

type GeneralFormValues = z.infer<typeof generalSchema>

export function GeneralSettingsForm({
  initialValues,
}: {
  initialValues: GeneralSettings
}) {
  const queryClient = useQueryClient()
  const normalizeImageValue = (value: string | null | undefined) =>
    value && value.trim() ? value : null

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema as never),
    defaultValues: {
      appName: initialValues.appName,
      appLogo: normalizeImageValue(initialValues.appLogo),
      appIcon: normalizeImageValue(initialValues.appIcon),
      appUrl: initialValues.appUrl,
    },
  })

  async function handleLogoUpload(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const result = await uploadAppLogoAction(formData)
    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: getGetSettingsGeneralQueryKey(),
      })
    }
    return result
  }

  async function handleIconUpload(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const result = await uploadAppIconAction(formData)
    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: getGetSettingsGeneralQueryKey(),
      })
    }
    return result
  }

  async function onSubmit(data: GeneralFormValues) {
    const nextValues: GeneralFormValues = {
      appName: data.appName,
      appLogo: normalizeImageValue(data.appLogo),
      appIcon: normalizeImageValue(data.appIcon),
      appUrl: data.appUrl,
    }

    const result = await updateGeneralSettingsAction({
      ...nextValues,
    })

    if (!result.success) {
      if (result.errors) {
        for (const [name, messages] of Object.entries(result.errors)) {
          form.setError(name as keyof GeneralFormValues, {
            message: messages?.[0],
          })
        }
      }
      toast.error(result.error ?? "Failed to update general settings")
      return
    }

    form.reset(nextValues)
    toast.success("General settings updated successfully")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>
          Configure global app branding and identity. These values apply
          everywhere the app is displayed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="general-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="appLogo"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>App Logo</FieldLabel>
                  <ImageUpload
                    value={field.value ?? ""}
                    onChange={(value) => {
                      const nextValue = value || null
                      field.onChange(nextValue)
                      form.setValue("appLogo", nextValue, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }}
                    onUpload={handleLogoUpload}
                    aspect="landscape"
                    label="Logo"
                  />
                  <FieldDescription>
                    Upload a logo image. Leave empty to use the default.
                  </FieldDescription>
                </Field>
              )}
            />
            <Controller
              name="appIcon"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>App Icon</FieldLabel>
                  <ImageUpload
                    value={field.value ?? ""}
                    onChange={(value) => {
                      const nextValue = value || null
                      field.onChange(nextValue)
                      form.setValue("appIcon", nextValue, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }}
                    onUpload={handleIconUpload}
                    accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
                    aspect="square"
                    label="Icon"
                  />
                  <FieldDescription>
                    Shown when the sidebar is collapsed and used as the browser
                    favicon. Square images work best.
                  </FieldDescription>
                </Field>
              )}
            />
            <InputField
              control={form.control}
              name="appName"
              label="App Name"
              description="The public name of your application."
              required
            />

            <InputField
              control={form.control}
              name="appUrl"
              label="App URL"
              description="The canonical URL where the app is hosted."
              required
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="general-form"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
