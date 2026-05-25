import { runAction } from "@workspace/api-client-react"
import {
  patchAccountProfile,
  patchAccountPassword,
} from "@workspace/api-client-react/generated/account/account"
import type { ActionResult } from "@/types/action-result"

export interface UpdateProfileActionData {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  contactNumber?: string
  avatar?: string
}

export async function updateProfileAction(
  data: UpdateProfileActionData
): Promise<ActionResult> {
  return runAction(
    () => patchAccountProfile(data),
    "Failed to update profile"
  )
}

export interface SecurityActionData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export async function changePasswordAction(
  data: SecurityActionData
): Promise<ActionResult> {
  return runAction(
    () => patchAccountPassword(data),
    "Failed to change password"
  )
}
