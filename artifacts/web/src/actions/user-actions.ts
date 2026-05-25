import { runAction } from "@workspace/api-client-react"
import {
  postUsers,
  patchUsersId,
  deleteUsersId,
} from "@workspace/api-client-react/generated/users/users"
import type {
  CreateUserInput,
  UserInput,
} from "@workspace/api-client-react/generated/index.schemas"
import type { ActionResult } from "@/types/action-result"

export interface UserActionData {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  contactNumber?: string
  avatar?: string
  password?: string
}

export async function createUserAction(
  data: UserActionData
): Promise<ActionResult> {
  return runAction(
    () => postUsers(data as unknown as CreateUserInput),
    "Failed to create user"
  )
}

export async function updateUserAction(
  id: string,
  data: UserActionData
): Promise<ActionResult> {
  return runAction(
    () => patchUsersId(id, data as unknown as UserInput),
    "Failed to update user"
  )
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  return runAction(() => deleteUsersId(id), "Failed to delete user")
}
