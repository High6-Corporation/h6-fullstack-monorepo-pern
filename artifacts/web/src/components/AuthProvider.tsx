import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useUser } from "@clerk/clerk-react"
import { AUTH_BYPASS } from "@/lib/authBypass"

export interface AuthUser {
  id: string
  email: string
  firstName: string
  middleName?: string | null
  lastName: string
  avatar?: string | null
  contactNumber?: string | null
}

type Status = "loading" | "authenticated" | "unauthenticated"

interface AuthCtx {
  user: AuthUser | null
  status: Status
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

const DEV_USER: AuthUser = {
  id: "dev-user",
  email: "dev@high6.local",
  firstName: "Dev",
  middleName: null,
  lastName: "User",
  avatar: null,
  contactNumber: null,
}

function BypassAuthProvider({ children }: { children: ReactNode }) {
  const refresh = useCallback(async () => {}, [])
  const logout = useCallback(async () => {
    window.location.href = "/login"
  }, [])
  const value = useMemo<AuthCtx>(
    () => ({ user: DEV_USER, status: "authenticated", refresh, logout }),
    [refresh, logout]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<Status>("loading")

  const refresh = useCallback(async () => {
    if (!isLoaded) {
      setStatus("loading")
      return
    }
    if (!isSignedIn || !clerkUser) {
      setUser(null)
      setStatus("unauthenticated")
      return
    }
    setUser({
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      firstName: clerkUser.firstName ?? "",
      middleName: null,
      lastName: clerkUser.lastName ?? "",
      avatar: clerkUser.imageUrl ?? null,
      contactNumber: null,
    })
    setStatus("authenticated")
  }, [isLoaded, isSignedIn, clerkUser])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    setUser(null)
    setStatus("unauthenticated")
  }, [])

  const value = useMemo(
    () => ({ user, status, refresh, logout }),
    [user, status, refresh, logout]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (AUTH_BYPASS) {
    return <BypassAuthProvider>{children}</BypassAuthProvider>
  }
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>")
  return v
}
