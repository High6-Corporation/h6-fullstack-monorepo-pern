
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
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
import { SwitchField } from "@/components/shared/form/SwitchField"
import { toast } from "sonner"
import { updateNotificationsAction } from "@/actions/settings-actions"
import type { NotificationsSettings } from "@/types/settings-types"

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsSchema>

export function NotificationsSettingsForm({
  initialValues,
}: {
  initialValues: NotificationsSettings
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema as never),
    defaultValues: {
      emailNotifications: initialValues.emailNotifications,
      pushNotifications: initialValues.pushNotifications,
      weeklyDigest: initialValues.weeklyDigest,
    },
  })

  async function onSubmit(data: NotificationsFormValues) {
    const result = await updateNotificationsAction(data)

    if (!result.success) {
      toast.error(result.error ?? "Failed to save preferences")
      return
    }

    reset(data)
    toast.success("Notification preferences saved")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what updates you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="notifications-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <SwitchField
              control={control}
              name="emailNotifications"
              label="Email Notifications"
              description="Receive email updates about deal activity"
            />
            <SwitchField
              control={control}
              name="pushNotifications"
              label="Push Notifications"
              description="Receive browser push notifications"
            />
            <SwitchField
              control={control}
              name="weeklyDigest"
              label="Weekly Digest"
              description="Get a weekly summary of pipeline activity"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="notifications-form"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? "Saving..." : "Save preferences"}
        </Button>
      </CardFooter>
    </Card>
  )
}
