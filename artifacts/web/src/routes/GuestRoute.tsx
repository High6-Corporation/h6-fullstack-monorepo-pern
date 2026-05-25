import { Navigate, Outlet, useSearchParams } from "react-router-dom"
import { useAuth } from "@/components/AuthProvider"

export function GuestRoute() {
  const { status } = useAuth()
  const [params] = useSearchParams()
  if (status === "loading") {
    return <div className="p-8 text-muted-foreground">Loading…</div>
  }
  if (status === "authenticated") {
    const from = params.get("from") || "/"
    return <Navigate to={from} replace />
  }
  return <Outlet />
}
