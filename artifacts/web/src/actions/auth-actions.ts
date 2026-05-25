import { runAction } from "@workspace/api-client-react"
import {
  postAuthLogin,
  postAuthLogout,
} from "@workspace/api-client-react/generated/auth/auth"
import type { ActionResult } from "@/types/action-result"

export interface LoginActionData {
  email: string
  password: string
}

/**
 * Calls POST /api/auth/login through the Orval-generated request function
 * and maps the standard API envelope into the `ActionResult` shape
 * expected by existing form components.
 */
export async function loginAction(
  data: LoginActionData
): Promise<ActionResult> {
  return runAction(
    () => postAuthLogin(data),
    "Login failed. Please try again."
  )
}

export async function logoutAction(): Promise<void> {
  try {
    await postAuthLogout()
  } catch {
    // ignore — we still want to redirect even if the request failed.
  }
  // Hard redirect so the in-memory React Query cache is cleared.
  if (typeof window !== "undefined") {
    window.location.assign("/login")
  }
}
