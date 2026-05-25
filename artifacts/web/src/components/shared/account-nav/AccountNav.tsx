import { Link, useLocation } from "react-router-dom"
import { User, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AccountNavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

const accountNavItems: AccountNavItem[] = [
  { title: "Profile", url: "/account/profile", icon: User },
  { title: "Security", url: "/account/security", icon: Shield },
]

export function AccountNav() {
  const pathname = useLocation().pathname

  return (
    <nav className="w-full md:w-44 md:shrink-0">
      <ul className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
        {accountNavItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <li key={item.url} className="shrink-0 md:w-full">
              <Link to={item.url}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-accent hover:text-accent-foreground",
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
