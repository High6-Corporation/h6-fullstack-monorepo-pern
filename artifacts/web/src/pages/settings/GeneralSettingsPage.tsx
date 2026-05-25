import { GeneralSettingsForm } from "@/components/features/settings/GeneralSettingsForm"
import { Spinner } from "@/components/ui/spinner"
import { useGeneralSettings } from "@/lib/api/settings"
import { SettingsShell } from "./SettingsShell"

export default function GeneralSettingsPage() {
  const { data, isLoading } = useGeneralSettings()
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }
  return (
    <SettingsShell>
      <GeneralSettingsForm initialValues={data} />
    </SettingsShell>
  )
}
