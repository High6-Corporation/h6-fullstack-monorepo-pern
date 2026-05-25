import { Link, useLocation } from "react-router-dom"
import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const LABELS: Record<string, string> = {
  posts: "Posts",
  users: "Users",
  settings: "Settings",
  account: "Account",
  general: "General",
  profile: "Profile",
  appearance: "Appearance",
  notifications: "Notifications",
  security: "Security",
  "help-center": "Help Center",
}

function labelFor(segment: string) {
  if (LABELS[segment]) return LABELS[segment]
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AppBreadcrumbs() {
  const pathname = useLocation().pathname
  const segments = pathname.split("/").filter(Boolean)

  const crumbs =
    segments.length === 0
      ? [{ href: "/", label: "Dashboard", isLast: true }]
      : [
          { href: "/", label: "Dashboard", isLast: false },
          ...segments.map((seg, i) => ({
            href: "/" + segments.slice(0, i + 1).join("/"),
            label: labelFor(seg),
            isLast: i === segments.length - 1,
          })),
        ]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <Fragment key={crumb.href}>
              <BreadcrumbItem
                className={!isLast ? "hidden md:block" : undefined}
              >
                {crumb.isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
