import { AppearanceSettingsForm } from "@/components/features/settings/AppearanceSettingsForm"
import { Spinner } from "@/components/ui/spinner"
import { useAppearanceSettings } from "@/lib/api/settings"
import { SettingsShell } from "./SettingsShell"


export default function AppearanceSettingsPage() {
  const { data, isLoading } = useAppearanceSettings();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }

  return (
      <SettingsShell>
        <AppearanceSettingsForm />
      </SettingsShell>
    )
}
