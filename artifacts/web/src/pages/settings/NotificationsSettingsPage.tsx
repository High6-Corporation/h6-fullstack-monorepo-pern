import { NotificationsSettingsForm } from "@/components/features/settings/NotificationsSettingsForm"
import { Spinner } from "@/components/ui/spinner"
import { useNotificationsSettings } from "@/lib/api/settings"
import { SettingsShell } from "./SettingsShell"

export default function NotificationsSettingsPage() {
  const { data, isLoading } = useNotificationsSettings()
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }
  return (
    <SettingsShell>
      <NotificationsSettingsForm initialValues={data} />
    </SettingsShell>
  )
}
