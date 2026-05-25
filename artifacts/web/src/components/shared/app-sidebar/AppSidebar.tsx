import { Link, useLocation } from "react-router-dom"
import { Image } from "@/components/shared/Image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { mainNavItems, navSecondary } from "@/data/main-nav-items"
import { NavUser } from "./NavUser"
import { cn } from "@/lib/utils"

export function AppSidebar({
  userName,
  userEmail,
  userAvatar,
  userInitials,
  appName,
  appLogo,
  appIcon,
}: {
  userName: string
  userEmail: string
  userAvatar?: string
  userInitials: string
  appName: string
  appLogo: string | null
  appIcon: string | null
}) {
  const pathname = useLocation().pathname

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="text-center">
                {appIcon ? (
                  <Image
                    src={appIcon}
                    alt={appName}
                    width={32}
                    height={32}
                    className="hidden size-8 shrink-0 object-contain group-data-[collapsible=icon]:block"
                  />
                ) : (
                  <Image
                    src="/high6-logo.png"
                    alt={appName}
                    width={32}
                    height={32}
                    className="hidden size-8 shrink-0 object-contain group-data-[collapsible=icon]:block"
                    unoptimized
                  />
                )}
                {appLogo ? (
                  <Image
                    src={appLogo}
                    alt={appName}
                    width={120}
                    height={32}
                    className="h-8 w-auto group-data-[collapsible=icon]:hidden"
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />
                ) : (
                  <Image
                    src="/high6-logo.png"
                    alt={appName}
                    width={120}
                    height={32}
                    className="h-8 w-auto shrink-0 object-contain group-data-[collapsible=icon]:hidden"
                    style={{ width: "auto", height: "auto" }}
                    unoptimized
                    priority
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {mainNavItems.map((section, index) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        // isActive={isActive}
                        className={cn(
                                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-accent hover:text-accent-foreground",
                                          isActive
                                            ? "bg-red-500 font-medium text-foreground"
                                            : "text-muted-foreground"
                                        )}
                        tooltip={item.title}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavUser
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          userInitials={userInitials}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
