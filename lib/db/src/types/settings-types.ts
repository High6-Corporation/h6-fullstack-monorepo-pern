/**
 * Client-safe settings types & constants.
 *
 * This module MUST NOT import from `./client` (which depends on `next/headers`)
 * so that Client Components can freely import these symbols without dragging
 * server-only code into the browser bundle.
 */

// ─── Theme Variables ────────────────────────────────────────────────────────

/** All shadcn CSS custom properties that a theme can override. */
export interface ThemeVariables {
  "--background": string
  "--foreground": string
  "--card": string
  "--card-foreground": string
  "--popover": string
  "--popover-foreground": string
  "--primary": string
  "--primary-foreground": string
  "--secondary": string
  "--secondary-foreground": string
  "--muted": string
  "--muted-foreground": string
  "--accent": string
  "--accent-foreground": string
  "--destructive": string
  "--destructive-foreground": string
  "--border": string
  "--input": string
  "--ring": string
  "--chart-1": string
  "--chart-2": string
  "--chart-3": string
  "--chart-4": string
  "--chart-5": string
  "--sidebar": string
  "--sidebar-foreground": string
  "--sidebar-primary": string
  "--sidebar-primary-foreground": string
  "--sidebar-accent": string
  "--sidebar-accent-foreground": string
  "--sidebar-border": string
  "--sidebar-ring": string

  // Font families
  "--font-sans": string
  "--font-serif": string
  "--font-mono": string

  // Radius
  "--radius": string
  "--radius-sm": string
  "--radius-md": string
  "--radius-lg": string
  "--radius-xl": string

  // Spacing and typography
  "--spacing": string
  "--tracking-normal": string

  // Shadows
  "--shadow-x": string
  "--shadow-y": string
  "--shadow-blur": string
  "--shadow-spread": string
  "--shadow-opacity": string
  "--shadow-color": string
  "--shadow-2xs": string
  "--shadow-xs": string
  "--shadow-sm": string
  "--shadow": string
  "--shadow-md": string
  "--shadow-lg": string
  "--shadow-xl": string
  "--shadow-2xl": string
}

/** Ordered list of every key in ThemeVariables — handy for iteration. */
export const THEME_VAR_KEYS: ReadonlyArray<keyof ThemeVariables> = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",

  // Font families
  "--font-sans",
  "--font-serif",
  "--font-mono",

  // Radius
  "--radius",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",

  // Spacing and typography
  "--spacing",
  "--tracking-normal",

  // Shadows
  "--shadow-x",
  "--shadow-y",
  "--shadow-blur",
  "--shadow-spread",
  "--shadow-opacity",
  "--shadow-color",
  "--shadow-2xs",
  "--shadow-xs",
  "--shadow-sm",
  "--shadow",
  "--shadow-md",
  "--shadow-lg",
  "--shadow-xl",
  "--shadow-2xl",
] as const

// ─── Color theme presets ────────────────────────────────────────────────────

export type ColorTheme =
  | "default"
  | "amethyst-haze"
  | "amber-minimal"
  | "bold-tech"
  | "bubblegum"
  | "caffeine"
  | "custom"

export const COLOR_THEMES: readonly ColorTheme[] = [
  "default",
  "amethyst-haze",
  "amber-minimal",
  "bold-tech",
  "bubblegum",
  "caffeine",
  "custom",
] as const

export const DEFAULT_CUSTOM_COLOR = "#1e88e5"

// ─── Settings interfaces ────────────────────────────────────────────────────

export interface GeneralSettings {
  appName: string
  appLogo: string | null
  appIcon: string | null
  appUrl: string
}

export interface AppearanceSettings {
  colorTheme: ColorTheme
  /** Hex value — legacy, kept for backward compat. */
  customColor?: string
  /** Full light-mode variable overrides. */
  light?: ThemeVariables
  /** Full dark-mode variable overrides. */
  dark?: ThemeVariables
  /** Border-radius override, e.g. "0.45rem". */
  radius?: string
}

export interface NotificationsSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
}

export interface HelpCenterSettings {
  userManual: string | null
  companyName: string
  companyEmail: string | null
  companyContactNumber: string | null
  companyWebsite: string | null
  supportCenterUrl: string | null
  facebookUrl: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  xUrl: string | null
}
