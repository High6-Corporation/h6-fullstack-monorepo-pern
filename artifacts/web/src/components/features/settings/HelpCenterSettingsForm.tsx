
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { updateHelpCenterSettingsAction } from "@/actions/settings-actions"
import { uploadUserManualAction } from "@/actions/upload-actions"
import { FileUpload } from "@/components/shared/file-upload/FileUpload"
import { InputField } from "@/components/shared/form/InputField"
import type { HelpCenterSettings } from "@/types/settings-types"

const helpCenterSchema = z.object({
  userManual: z
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z
    .string()
    .email("Must be a valid email")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  companyContactNumber: z
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  companyWebsite: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  supportCenterUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  facebookUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  instagramUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  xUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
})

type HelpCenterFormValues = z.infer<typeof helpCenterSchema>

export function HelpCenterSettingsForm({
  initialValues,
}: {
  initialValues: HelpCenterSettings
}) {
  const form = useForm<HelpCenterFormValues>({
    resolver: zodResolver(helpCenterSchema),
    defaultValues: {
      userManual: initialValues.userManual ?? null,
      companyName: initialValues.companyName,
      companyEmail: initialValues.companyEmail ?? "",
      companyContactNumber: initialValues.companyContactNumber ?? "",
      companyWebsite: initialValues.companyWebsite ?? "",
      supportCenterUrl: initialValues.supportCenterUrl ?? "",
      facebookUrl: initialValues.facebookUrl ?? "",
      linkedinUrl: initialValues.linkedinUrl ?? "",
      instagramUrl: initialValues.instagramUrl ?? "",
      xUrl: initialValues.xUrl ?? "",
    },
  })

  async function handleManualUpload(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    return uploadUserManualAction(formData)
  }

  async function onSubmit(data: HelpCenterFormValues) {
    const result = await updateHelpCenterSettingsAction(data)

    if (!result.success) {
      if (result.errors) {
        for (const [name, messages] of Object.entries(result.errors)) {
          form.setError(name as keyof HelpCenterFormValues, {
            message: messages?.[0],
          })
        }
      }
      toast.error(result.error ?? "Failed to update help center settings")
      return
    }

    form.reset(data)
    toast.success("Help center settings updated successfully")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Help Center</CardTitle>
        <CardDescription>
          Configure help center resources, company information, and support
          links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="help-center-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Documents */}
            <div className="space-y-4">
              <Controller
                name="userManual"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>User's Manual</FieldLabel>
                    <FileUpload
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onUpload={handleManualUpload}
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      label="User Manual"
                    />
                    <FieldDescription>
                      Upload the user manual in PDF or DOCX format.
                    </FieldDescription>
                  </Field>
                )}
              />
            </div>

            <Separator />

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Company Information</h3>
              <InputField
                control={form.control}
                name="companyName"
                label="Company Name"
                required
              />
              <InputField
                control={form.control}
                name="companyEmail"
                label="Company Email"
                type="email"
              />
              <InputField
                control={form.control}
                name="companyContactNumber"
                label="Contact Number"
              />
              <InputField
                control={form.control}
                name="companyWebsite"
                label="Website"
                placeholder="https://example.com"
              />
            </div>

            <Separator />

            {/* Support Center */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Support Center</h3>
              <InputField
                control={form.control}
                name="supportCenterUrl"
                label="Support Center URL"
                placeholder="https://support.example.com"
              />
            </div>

            <Separator />

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Social Media</h3>
              <InputField
                control={form.control}
                name="facebookUrl"
                label="Facebook"
                placeholder="https://facebook.com/yourpage"
              />
              <InputField
                control={form.control}
                name="linkedinUrl"
                label="LinkedIn"
                placeholder="https://linkedin.com/company/yourcompany"
              />
              <InputField
                control={form.control}
                name="instagramUrl"
                label="Instagram"
                placeholder="https://instagram.com/yourprofile"
              />
              <InputField
                control={form.control}
                name="xUrl"
                label="X (Twitter)"
                placeholder="https://x.com/yourhandle"
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="help-center-form"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
