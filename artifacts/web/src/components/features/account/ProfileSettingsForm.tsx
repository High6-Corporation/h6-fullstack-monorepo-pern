import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateProfileAction } from "@/actions/account-actions"
import { uploadAvatarFileAction } from "@/actions/upload-actions"
import { getUserInitials } from "@/lib/utils"
import { AvatarUpload } from "@/components/shared/image-upload/AvatarUpload"
import type { User } from "@/types/api"
import { InputField } from "@/components/shared/form/InputField"

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  contactNumber: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettingsForm({
  initialValues,
}: {
  initialValues: User
}) {
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState<string | undefined>(initialValues.avatar ?? undefined)
  const [avatarChanged, setAvatarChanged] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialValues.firstName,
      middleName: initialValues.middleName ?? "",
      lastName: initialValues.lastName,
      email: initialValues.email,
      contactNumber: initialValues.contactNumber ?? "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    const result = await updateProfileAction({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      contactNumber: data.contactNumber,
      avatar: avatarChanged ? avatar : (initialValues.avatar ?? undefined),
    })

    if (!result.success) {
      if (result.errors) {
        for (const [name, messages] of Object.entries(result.errors)) {
          form.setError(name as keyof ProfileFormValues, {
            message: messages?.[0],
          })
        }
      }
      toast.error(result.error ?? "Failed to update profile")
      return
    }

    setAvatarChanged(false)
    form.reset(data)
    window.location.reload()
    toast.success("Profile updated successfully")
  }

  const initials = getUserInitials({
    firstName: initialValues.firstName,
    lastName: initialValues.lastName,
  })

  async function handleAvatarUpload(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const result = await uploadAvatarFileAction(formData)
    if (result.success && result.path) {
      return { success: true, path: result.path }
    }
    return { success: false, error: result.error ?? "Failed to upload avatar" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <AvatarUpload
          value={avatar ?? ""}
          onChange={(path) => {
            setAvatar(path || undefined)
            setAvatarChanged(true)
          }}
          onUpload={handleAvatarUpload}
          fallback={initials}
          className="mb-6"
        />

        <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputField
              control={form.control}
              name="firstName"
              label="First Name"
              required
            />

            <InputField
              control={form.control}
              name="middleName"
              label="Middle Name"
            />

            <InputField
              control={form.control}
              name="lastName"
              label="Last Name"
              required
            />

            <InputField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              required
            />

            <InputField
              control={form.control}
              name="contactNumber"
              label="Contact Number"
              type="tel"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="profile-form"
          disabled={
            form.formState.isSubmitting ||
            (!form.formState.isDirty && !avatarChanged)
          }
        >
          {form.formState.isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
