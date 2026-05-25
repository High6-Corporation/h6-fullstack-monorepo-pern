import { Link } from "react-router-dom"
import { SignOutButton } from "@clerk/clerk-react"
import { ChevronsUpDown, LogOut, UserCircle } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { AUTH_BYPASS } from "@/lib/authBypass"

interface NavUserProps {
  userName: string
  userEmail: string
  userAvatar?: string
  userInitials: string
}

export function NavUser({
  userName,
  userEmail,
  userAvatar,
  userInitials,
}: NavUserProps) {
  const { isMobile } = useSidebar()

  const logOutItem = AUTH_BYPASS ? (
    <DropdownMenuItem onClick={() => { window.location.href = "/login" }}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  ) : (
    <SignOutButton redirectUrl="/login">
      <DropdownMenuItem>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </SignOutButton>
  )

  return (
    <SidebarMenu className="p-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="shadow-xs data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar>
                {userAvatar ? (
                  <AvatarImage src={userAvatar} alt={userName} />
                ) : null}
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-popper-anchor-width] min-w-56"
            align="end"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8">
                  {userAvatar ? (
                    <AvatarImage src={userAvatar} alt={userName} />
                  ) : null}
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/account/profile">
                  <UserCircle />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {logOutItem}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
