import { HelpCenterSettingsForm } from "@/components/features/settings/HelpCenterSettingsForm"
import { Spinner } from "@/components/ui/spinner"
import { useHelpCenterSettings } from "@/lib/api/settings"
import { SettingsShell } from "./SettingsShell"

export default function HelpCenterSettingsPage() {
  const { data, isLoading } = useHelpCenterSettings()
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }
  return (
    <SettingsShell>
      <HelpCenterSettingsForm initialValues={data} />
    </SettingsShell>
  )
}
