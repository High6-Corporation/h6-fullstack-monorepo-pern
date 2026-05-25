import { eq } from "drizzle-orm"
import { db } from "../connection"
import {
  generalSettings,
  appearanceSettings,
  notificationsSettings,
  helpCenterSettings,
} from "../schema"
import type {
  SelectGeneralSettings,
  SelectAppearanceSettings,
  SelectNotificationsSettings,
  SelectHelpCenterSettings,
} from "../schema"
import type {
  GeneralSettings,
  AppearanceSettings,
  NotificationsSettings,
  HelpCenterSettings,
  ThemeVariables,
} from "../types/settings-types"
// --- General Settings ---

function toGeneralSettings(row: SelectGeneralSettings): GeneralSettings {
  return {
    appName: row.appName,
    appLogo: row.appLogo ?? null,
    appIcon: row.appIcon ?? null,
    appUrl: row.appUrl,
  }
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const [row] = await db.select().from(generalSettings).limit(1)
  if (!row) {
    const [created] = await db
      .insert(generalSettings)
      .values({})
      .returning()
    return toGeneralSettings(created!)
  }
  return toGeneralSettings(row)
}

export async function updateGeneralSettings(
  data: GeneralSettings
): Promise<GeneralSettings> {
  // Ensure row exists
  await getGeneralSettings()
  const [existing] = await db
    .select({ id: generalSettings.id })
    .from(generalSettings)
    .limit(1)
  const [row] = await db
    .update(generalSettings)
    .set({
      appName: data.appName,
      appLogo: data.appLogo,
      appIcon: data.appIcon,
      appUrl: data.appUrl,
    })
    .where(eq(generalSettings.id, existing!.id))
    .returning()
  return toGeneralSettings(row!)
}

// --- Appearance Settings ---

function toAppearanceSettings(
  row: SelectAppearanceSettings
): AppearanceSettings {
  return {
    colorTheme: row.colorTheme as AppearanceSettings["colorTheme"],
    customColor: row.customColor ?? undefined,
    radius: row.radius ?? undefined,
    light: (row.light as unknown as ThemeVariables) ?? undefined,
    dark: (row.dark as unknown as ThemeVariables) ?? undefined,
  }
}

export async function getAppearanceSettings(): Promise<AppearanceSettings> {
  const [row] = await db.select().from(appearanceSettings).limit(1)
  if (!row) {
    const [created] = await db
      .insert(appearanceSettings)
      .values({})
      .returning()
    return toAppearanceSettings(created!)
  }
  return toAppearanceSettings(row)
}

export async function updateAppearanceSettings(
  data: AppearanceSettings
): Promise<AppearanceSettings> {
  await getAppearanceSettings()
  const [existing] = await db
    .select({ id: appearanceSettings.id })
    .from(appearanceSettings)
    .limit(1)
  const [row] = await db
    .update(appearanceSettings)
    .set({
      colorTheme: data.colorTheme,
      customColor: data.customColor,
      radius: data.radius,
      light: (data.light as unknown as Record<string, string>) ?? null,
      dark: (data.dark as unknown as Record<string, string>) ?? null,
    })
    .where(eq(appearanceSettings.id, existing!.id))
    .returning()
  return toAppearanceSettings(row!)
}

// --- Notifications Settings ---

function toNotificationsSettings(
  row: SelectNotificationsSettings
): NotificationsSettings {
  return {
    emailNotifications: row.emailNotifications,
    pushNotifications: row.pushNotifications,
    weeklyDigest: row.weeklyDigest,
  }
}

export async function getNotificationsSettings(): Promise<NotificationsSettings> {
  const [row] = await db.select().from(notificationsSettings).limit(1)
  if (!row) {
    const [created] = await db
      .insert(notificationsSettings)
      .values({})
      .returning()
    return toNotificationsSettings(created!)
  }
  return toNotificationsSettings(row)
}

export async function updateNotificationsSettings(
  data: NotificationsSettings
): Promise<NotificationsSettings> {
  await getNotificationsSettings()
  const [existing] = await db
    .select({ id: notificationsSettings.id })
    .from(notificationsSettings)
    .limit(1)
  const [row] = await db
    .update(notificationsSettings)
    .set({
      emailNotifications: data.emailNotifications,
      pushNotifications: data.pushNotifications,
      weeklyDigest: data.weeklyDigest,
    })
    .where(eq(notificationsSettings.id, existing!.id))
    .returning()
  return toNotificationsSettings(row!)
}

// --- Help Center Settings ---

function toHelpCenterSettings(
  row: SelectHelpCenterSettings
): HelpCenterSettings {
  return {
    userManual: row.userManual ?? null,
    companyName: row.companyName,
    companyEmail: row.companyEmail ?? null,
    companyContactNumber: row.companyContactNumber ?? null,
    companyWebsite: row.companyWebsite ?? null,
    supportCenterUrl: row.supportCenterUrl ?? null,
    facebookUrl: row.facebookUrl ?? null,
    linkedinUrl: row.linkedinUrl ?? null,
    instagramUrl: row.instagramUrl ?? null,
    xUrl: row.xUrl ?? null,
  }
}

export async function getHelpCenterSettings(): Promise<HelpCenterSettings> {
  const [row] = await db.select().from(helpCenterSettings).limit(1)
  if (!row) {
    const [created] = await db
      .insert(helpCenterSettings)
      .values({})
      .returning()
    return toHelpCenterSettings(created!)
  }
  return toHelpCenterSettings(row)
}

export async function updateHelpCenterSettings(
  data: HelpCenterSettings
): Promise<HelpCenterSettings> {
  await getHelpCenterSettings()
  const [existing] = await db
    .select({ id: helpCenterSettings.id })
    .from(helpCenterSettings)
    .limit(1)
  const [row] = await db
    .update(helpCenterSettings)
    .set({
      userManual: data.userManual,
      companyName: data.companyName,
      companyEmail: data.companyEmail,
      companyContactNumber: data.companyContactNumber,
      companyWebsite: data.companyWebsite,
      supportCenterUrl: data.supportCenterUrl,
      facebookUrl: data.facebookUrl,
      linkedinUrl: data.linkedinUrl,
      instagramUrl: data.instagramUrl,
      xUrl: data.xUrl,
    })
    .where(eq(helpCenterSettings.id, existing!.id))
    .returning()
  return toHelpCenterSettings(row!)
}
