import { runAction } from "@workspace/api-client-react"
import {
  patchSettingsGeneral,
  patchSettingsNotifications,
  patchSettingsHelpCenter,
} from "@workspace/api-client-react/generated/settings/settings"
import type { SettingsInput } from "@workspace/api-client-react/generated/index.schemas"
import type { ActionResult } from "@/types/action-result"

export async function updateGeneralSettingsAction(
  data: unknown
): Promise<ActionResult> {
  return runAction(
    () => patchSettingsGeneral(data as SettingsInput),
    "Failed to update general settings"
  )
}

export async function updateNotificationsAction(
  data: unknown
): Promise<ActionResult> {
  return runAction(
    () => patchSettingsNotifications(data as SettingsInput),
    "Failed to update notifications"
  )
}

export async function updateHelpCenterSettingsAction(
  data: unknown
): Promise<ActionResult> {
  return runAction(
    () => patchSettingsHelpCenter(data as SettingsInput),
    "Failed to update help center"
  )
}
