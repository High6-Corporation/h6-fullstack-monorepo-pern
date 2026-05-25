import {
  LayoutDashboard,
  Users,
  Newspaper,
  Building2,
  type LucideIcon,
  MessageCircleQuestion,
  Settings,
  UserCircle,
} from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  items?: NavItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const mainNavItems: NavSection[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      { title: "Departments", url: "/departments", icon: Building2 },
      { title: "Posts", url: "/posts", icon: Newspaper },
      { title: "Users", url: "/users", icon: Users },
    ],
  },
]

export const navSecondary: NavItem[] = [
  {
    title: "Settings",
    url: "/settings/general",
    icon: Settings,
  },
  {
    title: "Need Help?",
    url: "/help-center",
    icon: MessageCircleQuestion,
  },
]
