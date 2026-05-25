import {
  useGetSettingsGeneral,
  useGetSettingsAppearance,
  useGetSettingsNotifications,
  useGetSettingsHelpCenter,
  getGetSettingsGeneralQueryKey,
  getGetSettingsAppearanceQueryKey,
  getGetSettingsNotificationsQueryKey,
  getGetSettingsHelpCenterQueryKey,
} from "@workspace/api-client-react/generated/settings/settings"
import { type RawApiResponse } from "@workspace/api-client-react"
import {
  getSettingsGeneralResponse,
  getSettingsAppearanceResponse,
  getSettingsNotificationsResponse,
  getSettingsHelpCenterResponse,
} from "@workspace/api-zod/settings"
import { parseEnvelope } from "./_envelope"
import type {
  GeneralSettings,
  AppearanceSettings,
  NotificationsSettings,
  HelpCenterSettings,
} from "@/types/settings-types"

export type {
  GeneralSettings,
  AppearanceSettings,
  NotificationsSettings,
  HelpCenterSettings,
}

// The OpenAPI spec models settings payloads as free-form
// `Record<string, unknown>`, so the generated Zod schemas only validate
// the envelope shape and that `data` is an object. The concrete
// per-screen settings types live in `@/types/settings-types` and are
// applied here as the select callback's return type.
function selectGeneral(res: RawApiResponse): GeneralSettings {
  return parseEnvelope(res, getSettingsGeneralResponse)
    .data as unknown as GeneralSettings
}
function selectAppearance(res: RawApiResponse): AppearanceSettings {
  return parseEnvelope(res, getSettingsAppearanceResponse)
    .data as unknown as AppearanceSettings
}
function selectNotifications(res: RawApiResponse): NotificationsSettings {
  return parseEnvelope(res, getSettingsNotificationsResponse)
    .data as unknown as NotificationsSettings
}
function selectHelpCenter(res: RawApiResponse): HelpCenterSettings {
  return parseEnvelope(res, getSettingsHelpCenterResponse)
    .data as unknown as HelpCenterSettings
}

export function useGeneralSettings() {
  return useGetSettingsGeneral<GeneralSettings>({
    query: {
      queryKey: getGetSettingsGeneralQueryKey(),
      select: selectGeneral,
    },
  })
}

export function useAppearanceSettings() {
  return useGetSettingsAppearance<AppearanceSettings>({
    query: {
      queryKey: getGetSettingsAppearanceQueryKey(),
      select: selectAppearance,
    },
  })
}

export function useNotificationsSettings() {
  return useGetSettingsNotifications<NotificationsSettings>({
    query: {
      queryKey: getGetSettingsNotificationsQueryKey(),
      select: selectNotifications,
    },
  })
}

export function useHelpCenterSettings() {
  return useGetSettingsHelpCenter<HelpCenterSettings>({
    query: {
      queryKey: getGetSettingsHelpCenterQueryKey(),
      select: selectHelpCenter,
    },
  })
}
