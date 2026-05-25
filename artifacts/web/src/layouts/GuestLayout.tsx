import { Outlet } from "react-router-dom"
import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle"
import { useGeneralSettings } from "@/lib/api/settings"

export function GuestLayout() {
  const { data: general } = useGeneralSettings()
  const appName = general?.appName ?? "High6 Suite"
  const appLogo = general?.appLogo ?? null

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-2">
        <img
          src={appLogo || "/high6-logo.png"}
          alt={appName}
          className="h-10 w-auto"
        />
      </div>
      <div className="flex w-full max-w-sm justify-center md:max-w-3xl">
        <Outlet />
      </div>
    </div>
  )
}
