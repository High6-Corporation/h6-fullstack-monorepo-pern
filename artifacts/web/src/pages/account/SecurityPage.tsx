import { SecuritySettingsForm } from "@/components/features/account/SecuritySettingsForm"
import { AccountSettingShell } from "./AccountSettingShell"

export default function SecurityPage() {
  return (
    <AccountSettingShell>
      <SecuritySettingsForm
        initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
      />
    </AccountSettingShell>
  )
}
