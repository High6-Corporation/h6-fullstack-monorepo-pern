import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/app-sidebar/AppSidebar"
import { AppBreadcrumbs } from "@/components/shared/app-sidebar/AppBreadcrumbs"
import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle"
import { useAuth } from "@/components/AuthProvider"
import { useGeneralSettings } from "@/lib/api/settings"
import { getUserDisplayName, getUserInitials } from "@/lib/utils"

export function AuthLayout() {
  const { user } = useAuth()
  const { data: general } = useGeneralSettings()

  const userName = getUserDisplayName(user)
  const userInitials = getUserInitials(user)
  const appName = general?.appName ?? "High6 Suite"
  const appLogo = general?.appLogo ?? null
  const appIcon = general?.appIcon ?? null

  // Update document title and favicon based on settings
  useEffect(() => {
    // Update page title
    document.title = appName

    // Update favicon
    const faviconLink = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement | null
    if (faviconLink) {
      if (appIcon) {
        faviconLink.href = appIcon
        // Detect if it's an ICO file or image
        if (appIcon.endsWith(".ico")) {
          faviconLink.type = "image/x-icon"
        } else {
          faviconLink.type = "image/png"
        }
      } else {
        faviconLink.href = "/high6-icon.png"
        faviconLink.type = "image/png"
      }
    }
  }, [appName, appIcon])

  return (
    <SidebarProvider>
      <AppSidebar
        userName={userName}
        userEmail={user?.email ?? ""}
        userAvatar={user?.avatar ?? undefined}
        userInitials={userInitials}
        appName={appName}
        appLogo={appLogo}
        appIcon={appIcon}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <AppBreadcrumbs />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
