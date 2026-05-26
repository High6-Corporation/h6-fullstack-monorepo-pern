import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NamedUser {
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
}

/** Full display name: "First [Middle ]Last", collapsing empty parts. */
export function getUserDisplayName(user: NamedUser | null | undefined): string {
  if (!user) return ""
  return [user.firstName, user.middleName, user.lastName]
    .filter((part): part is string => !!part && part.trim().length > 0)
    .join(" ")
    .trim()
}

/** Two-letter initials from first + last name, uppercase. */
export function getUserInitials(user: NamedUser | null | undefined): string {
  if (!user) return ""
  const first = user.firstName?.trim()?.[0] ?? ""
  const last = user.lastName?.trim()?.[0] ?? ""
  return (first + last).toUpperCase()
}