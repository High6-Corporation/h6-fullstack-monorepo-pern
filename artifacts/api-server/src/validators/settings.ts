import { z } from "zod"

export const generalSettingsSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  appLogo: z
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  appIcon: z
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  appUrl: z.string().url("App URL must be a valid URL"),
})

export const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
})

const optionalUrl = z
  .string()
  .url("Must be a valid URL")
  .nullable()
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v))

export const helpCenterSchema = z.object({
  userManual: z
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z
    .string()
    .email("Must be a valid email")
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  companyContactNumber: z
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  companyWebsite: optionalUrl,
  supportCenterUrl: optionalUrl,
  facebookUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  xUrl: optionalUrl,
})

export const appearanceSchema = z.object({
  colorTheme: z.string().min(1),
  customColor: z.string().optional(),
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
  radius: z.string().optional(),
})

export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>
export type NotificationsInput = z.infer<typeof notificationsSchema>
export type HelpCenterInput = z.infer<typeof helpCenterSchema>
export type AppearanceInput = z.infer<typeof appearanceSchema>
