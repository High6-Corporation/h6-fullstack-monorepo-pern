import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"
import { generateId } from "../ulid"

// --- General Settings (single-row) ---

export const generalSettings = pgTable("general_settings", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$defaultFn(() => generateId()),
  appName: varchar("app_name", { length: 255 }).notNull().default("High6"),
  appLogo: varchar("app_logo", { length: 500 }),
  appIcon: varchar("app_icon", { length: 500 }),
  appUrl: varchar("app_url", { length: 500 }).notNull().default(""),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// --- Appearance Settings (single-row) ---

export const appearanceSettings = pgTable("appearance_settings", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$defaultFn(() => generateId()),
  colorTheme: varchar("color_theme", { length: 100 })
    .notNull()
    .default("default"),
  customColor: varchar("custom_color", { length: 50 }).default("#1e88e5"),
  radius: varchar("radius", { length: 20 }).default("0.45rem"),
  light: jsonb("light").$type<Record<string, string>>(),
  dark: jsonb("dark").$type<Record<string, string>>(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// --- Notifications Settings (single-row) ---

export const notificationsSettings = pgTable("notifications_settings", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$defaultFn(() => generateId()),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  pushNotifications: boolean("push_notifications").notNull().default(false),
  weeklyDigest: boolean("weekly_digest").notNull().default(true),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type SelectGeneralSettings = typeof generalSettings.$inferSelect
export type SelectAppearanceSettings = typeof appearanceSettings.$inferSelect
export type SelectNotificationsSettings =
  typeof notificationsSettings.$inferSelect

// --- Help Center Settings (single-row) ---

export const helpCenterSettings = pgTable("help_center_settings", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$defaultFn(() => generateId()),
  userManual: varchar("user_manual", { length: 500 }),
  companyName: varchar("company_name", { length: 255 }).notNull().default(""),
  companyEmail: varchar("company_email", { length: 255 }),
  companyContactNumber: varchar("company_contact_number", { length: 50 }),
  companyWebsite: varchar("company_website", { length: 500 }),
  supportCenterUrl: varchar("support_center_url", { length: 500 }),
  facebookUrl: varchar("facebook_url", { length: 500 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  instagramUrl: varchar("instagram_url", { length: 500 }),
  xUrl: varchar("x_url", { length: 500 }),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type SelectHelpCenterSettings = typeof helpCenterSettings.$inferSelect
