import { ProfileSettingsForm } from "@/components/features/account/ProfileSettingsForm"
import { useAuth } from "@/components/AuthProvider"
import { Spinner } from "@/components/ui/spinner"
import { AccountSettingShell } from "./AccountSettingShell"

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }
  return (
    <AccountSettingShell>
      <ProfileSettingsForm
        initialValues={{
          id: user.id,
          firstName: user.firstName,
          middleName: user.middleName ?? undefined,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber ?? undefined,
          avatar: user.avatar ?? undefined,
        }}
      />
    </AccountSettingShell>
  )
}
