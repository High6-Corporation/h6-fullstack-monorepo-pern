import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/components/AuthProvider"

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return <div className="p-8 text-muted-foreground">Loading…</div>
  }
  if (status === "unauthenticated") {
    return (
      <Navigate
        to={`/login?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }
  return <Outlet />
}
