import { Link, useLocation } from "react-router-dom"
import { Settings2, Palette, Bell, LifeBuoy } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SettingsNavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

const settingsNavItems: SettingsNavItem[] = [
  { title: "General", url: "/settings/general", icon: Settings2 },
  { title: "Appearance", url: "/settings/appearance", icon: Palette },
  { title: "Notifications", url: "/settings/notifications", icon: Bell },
  { title: "Help Center", url: "/settings/help-center", icon: LifeBuoy },
]

export function SettingsNav() {
  const pathname = useLocation().pathname

  return (
    <nav className="w-full">
      <ul className="flex flex-col gap-1">
        {settingsNavItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <li key={item.url} className="w-full">
              <Link
                to={item.url}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
