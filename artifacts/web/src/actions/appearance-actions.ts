import { runAction } from "@workspace/api-client-react"
import { patchSettingsAppearance } from "@workspace/api-client-react/generated/settings/settings"
import type { SettingsInput } from "@workspace/api-client-react/generated/index.schemas"
import type { ActionResult } from "@/types/action-result"
import type { AppearanceSettings } from "@/types/settings-types"

export async function updateColorThemeAction(
  data: AppearanceSettings
): Promise<ActionResult> {
  return runAction(
    () => patchSettingsAppearance(data as unknown as SettingsInput),
    "Failed to update theme"
  )
}
