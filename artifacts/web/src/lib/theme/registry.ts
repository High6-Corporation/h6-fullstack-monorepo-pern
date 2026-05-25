/**
 * Theme registry — every prebuilt theme's full set of CSS custom properties.
 *
 * Values are extracted from the shadcn default palette, its colour variants,
 * and tweakcn's built-in theme collection (42+ professional presets).
 * All values use the `oklch()` colour space to match the shadcn convention.
 */

import { hexToOklch } from "@/lib/theme/palette"
import type { ThemeVariables } from "@/types/settings-types"

// ─── Preset type ────────────────────────────────────────────────────────────

export interface ThemePreset {
  name: string
  label: string
  light: ThemeVariables
  dark: ThemeVariables
  radius: string
}

// ─── Default (base shadcn palette) ─────────────────────────────────────────

const DEFAULT_LIGHT: ThemeVariables = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.145 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.145 0 0)",
  "--primary": "oklch(0.488 0.243 264.376)",
  "--primary-foreground": "oklch(0.97 0.014 254.604)",
  "--secondary": "oklch(0.967 0.001 286.375)",
  "--secondary-foreground": "oklch(0.21 0.006 285.885)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--destructive-foreground": "oklch(0.97 0.014 254.604)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--chart-1": "oklch(0.809 0.105 251.813)",
  "--chart-2": "oklch(0.623 0.214 259.815)",
  "--chart-3": "oklch(0.546 0.245 262.881)",
  "--chart-4": "oklch(0.488 0.243 264.376)",
  "--chart-5": "oklch(0.424 0.199 265.638)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.145 0 0)",
  "--sidebar-primary": "oklch(0.546 0.245 262.881)",
  "--sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
  "--sidebar-accent": "oklch(0.97 0 0)",
  "--sidebar-accent-foreground": "oklch(0.205 0 0)",
  "--sidebar-border": "oklch(0.922 0 0)",
  "--sidebar-ring": "oklch(0.708 0 0)",

  // Font families
  "--font-sans": "var(--font-inter), sans-serif",
  "--font-serif": "var(--font-lora), serif",
  "--font-mono": "var(--font-geist-mono), monospace",

  // Radius
  "--radius": "0.45rem",
  "--radius-sm": "calc(var(--radius) - 4px)",
  "--radius-md": "calc(var(--radius) - 2px)",
  "--radius-lg": "var(--radius)",
  "--radius-xl": "calc(var(--radius) + 4px)",

  // Spacing and typography
  "--spacing": "0.25rem",
  "--tracking-normal": "0em",

  // Shadows
  "--shadow-x": "1px",
  "--shadow-y": "2px",
  "--shadow-blur": "5px",
  "--shadow-spread": "1px",
  "--shadow-opacity": "0.06",
  "--shadow-color": "hsl(0 0% 0%)",
  "--shadow-2xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
  "--shadow-xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
  "--shadow-sm":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
  "--shadow":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-md":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 2px 4px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-lg":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-xl":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 8px 10px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-2xl": "1px 2px 5px 1px hsl(0 0% 0% / 0.15)",
}

const DEFAULT_DARK: ThemeVariables = {
  "--background": "oklch(0.145 0 0)",
  "--foreground": "oklch(0.985 0 0)",
  "--card": "oklch(0.205 0 0)",
  "--card-foreground": "oklch(0.985 0 0)",
  "--popover": "oklch(0.205 0 0)",
  "--popover-foreground": "oklch(0.985 0 0)",
  "--primary": "oklch(0.424 0.199 265.638)",
  "--primary-foreground": "oklch(0.97 0.014 254.604)",
  "--secondary": "oklch(0.274 0.006 286.033)",
  "--secondary-foreground": "oklch(0.985 0 0)",
  "--muted": "oklch(0.269 0 0)",
  "--muted-foreground": "oklch(0.708 0 0)",
  "--accent": "oklch(0.269 0 0)",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--destructive": "oklch(0.704 0.191 22.216)",
  "--destructive-foreground": "oklch(0.985 0 0)",
  "--border": "oklch(1 0 0 / 10%)",
  "--input": "oklch(1 0 0 / 15%)",
  "--ring": "oklch(0.556 0 0)",
  "--chart-1": "oklch(0.809 0.105 251.813)",
  "--chart-2": "oklch(0.623 0.214 259.815)",
  "--chart-3": "oklch(0.546 0.245 262.881)",
  "--chart-4": "oklch(0.488 0.243 264.376)",
  "--chart-5": "oklch(0.424 0.199 265.638)",
  "--sidebar": "oklch(0.205 0 0)",
  "--sidebar-foreground": "oklch(0.985 0 0)",
  "--sidebar-primary": "oklch(0.623 0.214 259.815)",
  "--sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
  "--sidebar-accent": "oklch(0.269 0 0)",
  "--sidebar-accent-foreground": "oklch(0.985 0 0)",
  "--sidebar-border": "oklch(1 0 0 / 10%)",
  "--sidebar-ring": "oklch(0.556 0 0)",

  // Font families
  "--font-sans": "var(--font-inter), sans-serif",
  "--font-serif": "var(--font-lora), serif",
  "--font-mono": "var(--font-geist-mono), monospace",

  // Radius
  "--radius": "0.45rem",
  "--radius-sm": "calc(var(--radius) - 4px)",
  "--radius-md": "calc(var(--radius) - 2px)",
  "--radius-lg": "var(--radius)",
  "--radius-xl": "calc(var(--radius) + 4px)",

  // Spacing and typography
  "--spacing": "0.25rem",
  "--tracking-normal": "0em",

  // Shadows
  "--shadow-x": "1px",
  "--shadow-y": "2px",
  "--shadow-blur": "5px",
  "--shadow-spread": "1px",
  "--shadow-opacity": "0.06",
  "--shadow-color": "hsl(0 0% 0%)",
  "--shadow-2xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
  "--shadow-xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
  "--shadow-sm":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
  "--shadow":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-md":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 2px 4px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-lg":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-xl":
    "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 8px 10px 0px hsl(0 0% 0% / 0.06)",
  "--shadow-2xl": "1px 2px 5px 1px hsl(0 0% 0% / 0.15)",
}

const DEFAULT_RADIUS = "0.45rem"

// ─── Helper: override only accent tokens from a seed hue ───────────────────
// This mirrors what the old [data-theme] blocks did — override primary,
// ring, charts, sidebar-primary while leaving neutral tokens alone.

function accentOverride(
  hue: number,
  lightPrimary: string,
  lightFg: string,
  darkPrimary: string,
  darkFg: string,
  lightCharts: [string, string, string, string, string],
  darkCharts: [string, string, string, string, string]
): { light: Partial<ThemeVariables>; dark: Partial<ThemeVariables> } {
  return {
    light: {
      "--primary": lightPrimary,
      "--primary-foreground": lightFg,
      "--ring": lightPrimary,
      "--chart-1": lightCharts[0],
      "--chart-2": lightCharts[1],
      "--chart-3": lightCharts[2],
      "--chart-4": lightCharts[3],
      "--chart-5": lightCharts[4],
      "--sidebar-primary": lightPrimary,
      "--sidebar-primary-foreground": lightFg,
      "--sidebar-ring": lightPrimary,
    },
    dark: {
      "--primary": darkPrimary,
      "--primary-foreground": darkFg,
      "--ring": darkPrimary,
      "--chart-1": darkCharts[0],
      "--chart-2": darkCharts[1],
      "--chart-3": darkCharts[2],
      "--chart-4": darkCharts[3],
      "--chart-5": darkCharts[4],
      "--sidebar-primary": darkPrimary,
      "--sidebar-primary-foreground": darkFg,
      "--sidebar-ring": darkPrimary,
    },
  }
}

function merge(
  base: ThemeVariables,
  override: Partial<ThemeVariables>
): ThemeVariables {
  return { ...base, ...override }
}

// ─── All presets ────────────────────────────────────────────────────────────

export const THEME_PRESETS: Record<string, ThemePreset> = {
  default: {
    name: "default",
    label: "Default",
    light: DEFAULT_LIGHT,
    dark: DEFAULT_DARK,
    radius: DEFAULT_RADIUS,
  },

  "amethyst-haze": {
    name: "amethyst-haze",
    label: "Amethyst Haze",
    light: {
      "--background": "oklch(0.9777 0.0041 301.4256)",
      "--foreground": "oklch(0.3651 0.0325 287.0807)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.3651 0.0325 287.0807)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.3651 0.0325 287.0807)",
      "--primary": "oklch(0.6104 0.0767 299.7335)",
      "--primary-foreground": "oklch(0.9777 0.0041 301.4256)",
      "--secondary": "oklch(0.8957 0.0265 300.2416)",
      "--secondary-foreground": "oklch(0.3651 0.0325 287.0807)",
      "--muted": "oklch(0.8906 0.0139 299.7754)",
      "--muted-foreground": "oklch(0.5288 0.0375 290.7895)",
      "--accent": "oklch(0.7889 0.0802 359.9375)",
      "--accent-foreground": "oklch(0.3394 0.0441 1.7583)",
      "--destructive": "oklch(0.6332 0.1578 22.6734)",
      "--destructive-foreground": "oklch(0.9777 0.0041 301.4256)",
      "--border": "oklch(0.8447 0.0226 300.1421)",
      "--input": "oklch(0.9329 0.0124 301.2783)",
      "--ring": "oklch(0.6104 0.0767 299.7335)",
      "--chart-1": "oklch(0.6104 0.0767 299.7335)",
      "--chart-2": "oklch(0.7889 0.0802 359.9375)",
      "--chart-3": "oklch(0.7321 0.0749 169.867)",
      "--chart-4": "oklch(0.854 0.0882 76.8292)",
      "--chart-5": "oklch(0.7857 0.0645 258.0839)",
      "--sidebar": "oklch(0.9554 0.0082 301.3541)",
      "--sidebar-foreground": "oklch(0.3651 0.0325 287.0807)",
      "--sidebar-primary": "oklch(0.6104 0.0767 299.7335)",
      "--sidebar-primary-foreground": "oklch(0.9777 0.0041 301.4256)",
      "--sidebar-accent": "oklch(0.7889 0.0802 359.9375)",
      "--sidebar-accent-foreground": "oklch(0.3394 0.0441 1.7583)",
      "--sidebar-border": "oklch(0.8719 0.0198 302.169)",
      "--sidebar-ring": "oklch(0.6104 0.0767 299.7335)",

      // Fonts
      "--font-sans": "var(--font-geist), sans-serif",
      "--font-serif": "var(--font-lora), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      // Radius
      "--radius": "0.5rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      // Spacing / typography
      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      // Shadows
      "--shadow-x": "1px",
      "--shadow-y": "2px",
      "--shadow-blur": "5px",
      "--shadow-spread": "1px",
      "--shadow-opacity": "0.06",
      "--shadow-color": "hsl(0 0% 0%)",
      "--shadow-2xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
      "--shadow-xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
      "--shadow-sm":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
      "--shadow":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-md":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 2px 4px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-lg":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-xl":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 8px 10px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-2xl": "1px 2px 5px 1px hsl(0 0% 0% / 0.15)",
    },

    dark: {
      "--background": "oklch(0.2166 0.0215 292.8474)",
      "--foreground": "oklch(0.9053 0.0245 293.557)",
      "--card": "oklch(0.2544 0.0301 292.7315)",
      "--card-foreground": "oklch(0.9053 0.0245 293.557)",
      "--popover": "oklch(0.2544 0.0301 292.7315)",
      "--popover-foreground": "oklch(0.9053 0.0245 293.557)",
      "--primary": "oklch(0.7058 0.0777 302.0489)",
      "--primary-foreground": "oklch(0.2166 0.0215 292.8474)",
      "--secondary": "oklch(0.4604 0.0472 295.5578)",
      "--secondary-foreground": "oklch(0.9053 0.0245 293.557)",
      "--muted": "oklch(0.256 0.032 294.838)",
      "--muted-foreground": "oklch(0.6974 0.0282 300.0614)",
      "--accent": "oklch(0.3181 0.0321 308.6149)",
      "--accent-foreground": "oklch(0.8391 0.0692 2.6681)",
      "--destructive": "oklch(0.6875 0.142 21.4566)",
      "--destructive-foreground": "oklch(0.2166 0.0215 292.8474)",
      "--border": "oklch(0.3063 0.0359 293.3367)",
      "--input": "oklch(0.2847 0.0346 291.2726)",
      "--ring": "oklch(0.7058 0.0777 302.0489)",
      "--chart-1": "oklch(0.7058 0.0777 302.0489)",
      "--chart-2": "oklch(0.8391 0.0692 2.6681)",
      "--chart-3": "oklch(0.7321 0.0749 169.867)",
      "--chart-4": "oklch(0.854 0.0882 76.8292)",
      "--chart-5": "oklch(0.7857 0.0645 258.0839)",
      "--sidebar": "oklch(0.1985 0.02 293.6639)",
      "--sidebar-foreground": "oklch(0.9053 0.0245 293.557)",
      "--sidebar-primary": "oklch(0.7058 0.0777 302.0489)",
      "--sidebar-primary-foreground": "oklch(0.2166 0.0215 292.8474)",
      "--sidebar-accent": "oklch(0.3181 0.0321 308.6149)",
      "--sidebar-accent-foreground": "oklch(0.8391 0.0692 2.6681)",
      "--sidebar-border": "oklch(0.2847 0.0346 291.2726)",
      "--sidebar-ring": "oklch(0.7058 0.0777 302.0489)",

      // Fonts
      "--font-sans": "var(--font-geist), sans-serif",
      "--font-serif": "var(--font-lora), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      // Radius
      "--radius": "0.5rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      // Spacing / typography
      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      // Shadows (same as light)
      "--shadow-x": "1px",
      "--shadow-y": "2px",
      "--shadow-blur": "5px",
      "--shadow-spread": "1px",
      "--shadow-opacity": "0.06",
      "--shadow-color": "hsl(0 0% 0%)",
      "--shadow-2xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
      "--shadow-xs": "1px 2px 5px 1px hsl(0 0% 0% / 0.03)",
      "--shadow-sm":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
      "--shadow":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-md":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 2px 4px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-lg":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-xl":
        "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 8px 10px 0px hsl(0 0% 0% / 0.06)",
      "--shadow-2xl": "1px 2px 5px 1px hsl(0 0% 0% / 0.15)",
    },

    radius: "0.5rem",
  },

  "amber-minimal": {
    name: "amber-minimal",
    label: "Amber Minimal",
    light: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.2686 0 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.2686 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.2686 0 0)",
      "--primary": "oklch(0.7686 0.1647 70.0804)",
      "--primary-foreground": "oklch(0 0 0)",
      "--secondary": "oklch(0.967 0.0029 264.5419)",
      "--secondary-foreground": "oklch(0.4461 0.0263 256.8018)",
      "--muted": "oklch(0.9846 0.0017 247.8389)",
      "--muted-foreground": "oklch(0.551 0.0234 264.3637)",
      "--accent": "oklch(0.9869 0.0214 95.2774)",
      "--accent-foreground": "oklch(0.4732 0.1247 46.2007)",
      "--destructive": "oklch(0.6368 0.2078 25.3313)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.9276 0.0058 264.5313)",
      "--input": "oklch(0.9276 0.0058 264.5313)",
      "--ring": "oklch(0.7686 0.1647 70.0804)",
      "--chart-1": "oklch(0.7686 0.1647 70.0804)",
      "--chart-2": "oklch(0.6658 0.1574 58.3183)",
      "--chart-3": "oklch(0.5553 0.1455 48.9975)",
      "--chart-4": "oklch(0.4732 0.1247 46.2007)",
      "--chart-5": "oklch(0.4137 0.1054 45.9038)",
      "--sidebar": "oklch(0.9846 0.0017 247.8389)",
      "--sidebar-foreground": "oklch(0.2686 0 0)",
      "--sidebar-primary": "oklch(0.7686 0.1647 70.0804)",
      "--sidebar-primary-foreground": "oklch(1 0 0)",
      "--sidebar-accent": "oklch(0.9869 0.0214 95.2774)",
      "--sidebar-accent-foreground": "oklch(0.4732 0.1247 46.2007)",
      "--sidebar-border": "oklch(0.9276 0.0058 264.5313)",
      "--sidebar-ring": "oklch(0.7686 0.1647 70.0804)",

      // Fonts
      "--font-sans": "var(--font-inter), sans-serif",
      "--font-serif": "var(--font-source-serif-4), serif",
      "--font-mono": "var(--font-jetbrains-mono), monospace",

      // Radius
      "--radius": "0.375rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      // Spacing / typography
      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      // Shadows
      "--shadow-x": "0px",
      "--shadow-y": "4px",
      "--shadow-blur": "8px",
      "--shadow-spread": "-1px",
      "--shadow-opacity": "0.1",
      "--shadow-color": "hsl(0 0% 0%)",
      "--shadow-2xs": "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
      "--shadow-xs": "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
      "--shadow-sm":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)",
      "--shadow":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-md":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-lg":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-xl":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 8px 10px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-2xl": "0px 4px 8px -1px hsl(0 0% 0% / 0.25)",
    },

    dark: {
      "--background": "oklch(0.2046 0 0)",
      "--foreground": "oklch(0.9219 0 0)",
      "--card": "oklch(0.2686 0 0)",
      "--card-foreground": "oklch(0.9219 0 0)",
      "--popover": "oklch(0.2686 0 0)",
      "--popover-foreground": "oklch(0.9219 0 0)",
      "--primary": "oklch(0.7686 0.1647 70.0804)",
      "--primary-foreground": "oklch(0 0 0)",
      "--secondary": "oklch(0.2686 0 0)",
      "--secondary-foreground": "oklch(0.9219 0 0)",
      "--muted": "oklch(0.2393 0 0)",
      "--muted-foreground": "oklch(0.7155 0 0)",
      "--accent": "oklch(0.4732 0.1247 46.2007)",
      "--accent-foreground": "oklch(0.9243 0.1151 95.7459)",
      "--destructive": "oklch(0.6368 0.2078 25.3313)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.3715 0 0)",
      "--input": "oklch(0.3715 0 0)",
      "--ring": "oklch(0.7686 0.1647 70.0804)",
      "--chart-1": "oklch(0.8369 0.1644 84.4286)",
      "--chart-2": "oklch(0.6658 0.1574 58.3183)",
      "--chart-3": "oklch(0.4732 0.1247 46.2007)",
      "--chart-4": "oklch(0.5553 0.1455 48.9975)",
      "--chart-5": "oklch(0.4732 0.1247 46.2007)",
      "--sidebar": "oklch(0.1684 0 0)",
      "--sidebar-foreground": "oklch(0.9219 0 0)",
      "--sidebar-primary": "oklch(0.7686 0.1647 70.0804)",
      "--sidebar-primary-foreground": "oklch(1 0 0)",
      "--sidebar-accent": "oklch(0.4732 0.1247 46.2007)",
      "--sidebar-accent-foreground": "oklch(0.9243 0.1151 95.7459)",
      "--sidebar-border": "oklch(0.3715 0 0)",
      "--sidebar-ring": "oklch(0.7686 0.1647 70.0804)",

      // Fonts
      "--font-sans": "var(--font-inter), sans-serif",
      "--font-serif": "var(--font-source-serif-4), serif",
      "--font-mono": "var(--font-jetbrains-mono), monospace",

      // Radius
      "--radius": "0.375rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      // Spacing / typography
      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      // Shadows (same)
      "--shadow-x": "0px",
      "--shadow-y": "4px",
      "--shadow-blur": "8px",
      "--shadow-spread": "-1px",
      "--shadow-opacity": "0.1",
      "--shadow-color": "hsl(0 0% 0%)",
      "--shadow-2xs": "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
      "--shadow-xs": "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
      "--shadow-sm":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)",
      "--shadow":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-md":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-lg":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-xl":
        "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 8px 10px -2px hsl(0 0% 0% / 0.10)",
      "--shadow-2xl": "0px 4px 8px -1px hsl(0 0% 0% / 0.25)",
    },

    radius: "0.375rem",
  },

  "bold-tech": {
    name: "bold-tech",
    label: "Bold Tech",
    light: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.3588 0.1354 278.6973)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.3588 0.1354 278.6973)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.3588 0.1354 278.6973)",
      "--primary": "oklch(0.6056 0.2189 292.7172)",
      "--primary-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.9618 0.0202 295.1913)",
      "--secondary-foreground": "oklch(0.4568 0.2146 277.0229)",
      "--muted": "oklch(0.9691 0.0161 293.7558)",
      "--muted-foreground": "oklch(0.5413 0.2466 293.009)",
      "--accent": "oklch(0.9319 0.0316 255.5855)",
      "--accent-foreground": "oklch(0.4244 0.1809 265.6377)",
      "--destructive": "oklch(0.6368 0.2078 25.3313)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.9299 0.0334 272.7879)",
      "--input": "oklch(0.9299 0.0334 272.7879)",
      "--ring": "oklch(0.6056 0.2189 292.7172)",
      "--chart-1": "oklch(0.6056 0.2189 292.7172)",
      "--chart-2": "oklch(0.5413 0.2466 293.009)",
      "--chart-3": "oklch(0.4907 0.2412 292.5809)",
      "--chart-4": "oklch(0.432 0.2106 292.7591)",
      "--chart-5": "oklch(0.3796 0.1783 293.7446)",
      "--sidebar": "oklch(0.9691 0.0161 293.7558)",
      "--sidebar-foreground": "oklch(0.3588 0.1354 278.6973)",
      "--sidebar-primary": "oklch(0.6056 0.2189 292.7172)",
      "--sidebar-primary-foreground": "oklch(1 0 0)",
      "--sidebar-accent": "oklch(0.9319 0.0316 255.5855)",
      "--sidebar-accent-foreground": "oklch(0.4244 0.1809 265.6377)",
      "--sidebar-border": "oklch(0.9299 0.0334 272.7879)",
      "--sidebar-ring": "oklch(0.6056 0.2189 292.7172)",

      // Fonts
      "--font-sans": "var(--font-roboto), sans-serif",
      "--font-serif": "var(--font-playfair-display), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      // Radius
      "--radius": "0.625rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      // Spacing / typography
      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      // Shadows
      "--shadow-x": "2px",
      "--shadow-y": "2px",
      "--shadow-blur": "4px",
      "--shadow-spread": "0px",
      "--shadow-opacity": "0.2",
      "--shadow-color": "hsl(255 86% 66%)",
      "--shadow-2xs": "2px 2px 4px 0px hsl(255 86% 66% / 0.10)",
      "--shadow-xs": "2px 2px 4px 0px hsl(255 86% 66% / 0.10)",
      "--shadow-sm":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 1px 2px -1px hsl(255 86% 66% / 0.20)",
      "--shadow":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 1px 2px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-md":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 2px 4px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-lg":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 4px 6px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-xl":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 8px 10px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-2xl": "2px 2px 4px 0px hsl(255 86% 66% / 0.50)",
    },

    dark: {
      "--background": "oklch(0.2077 0.0398 265.7549)",
      "--foreground": "oklch(0.9299 0.0334 272.7879)",
      "--card": "oklch(0.2573 0.0861 281.2883)",
      "--card-foreground": "oklch(0.9299 0.0334 272.7879)",
      "--popover": "oklch(0.2573 0.0861 281.2883)",
      "--popover-foreground": "oklch(0.9299 0.0334 272.7879)",
      "--primary": "oklch(0.6056 0.2189 292.7172)",
      "--primary-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.2573 0.0861 281.2883)",
      "--secondary-foreground": "oklch(0.9299 0.0334 272.7879)",
      "--muted": "oklch(0.2329 0.0919 279.1398)",
      "--muted-foreground": "oklch(0.8112 0.1013 293.5712)",
      "--accent": "oklch(0.4568 0.2146 277.0229)",
      "--accent-foreground": "oklch(0.9299 0.0334 272.7879)",
      "--destructive": "oklch(0.6368 0.2078 25.3313)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.2827 0.1351 291.0894)",
      "--input": "oklch(0.2827 0.1351 291.0894)",
      "--ring": "oklch(0.6056 0.2189 292.7172)",
      "--chart-1": "oklch(0.709 0.1592 293.5412)",
      "--chart-2": "oklch(0.6056 0.2189 292.7172)",
      "--chart-3": "oklch(0.5413 0.2466 293.009)",
      "--chart-4": "oklch(0.4907 0.2412 292.5809)",
      "--chart-5": "oklch(0.432 0.2106 292.7591)",
      "--sidebar": "oklch(0.2077 0.0398 265.7549)",
      "--sidebar-foreground": "oklch(0.9299 0.0334 272.7879)",
      "--sidebar-primary": "oklch(0.6056 0.2189 292.7172)",
      "--sidebar-primary-foreground": "oklch(1 0 0)",
      "--sidebar-accent": "oklch(0.4568 0.2146 277.0229)",
      "--sidebar-accent-foreground": "oklch(0.9299 0.0334 272.7879)",
      "--sidebar-border": "oklch(0.2827 0.1351 291.0894)",
      "--sidebar-ring": "oklch(0.6056 0.2189 292.7172)",

      // Fonts
      "--font-sans": "var(--font-roboto), sans-serif",
      "--font-serif": "var(--font-playfair-display), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      // Radius
      "--radius": "0.625rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      // Spacing / typography
      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      // Shadows (same)
      "--shadow-x": "2px",
      "--shadow-y": "2px",
      "--shadow-blur": "4px",
      "--shadow-spread": "0px",
      "--shadow-opacity": "0.2",
      "--shadow-color": "hsl(255 86% 66%)",
      "--shadow-2xs": "2px 2px 4px 0px hsl(255 86% 66% / 0.10)",
      "--shadow-xs": "2px 2px 4px 0px hsl(255 86% 66% / 0.10)",
      "--shadow-sm":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 1px 2px -1px hsl(255 86% 66% / 0.20)",
      "--shadow":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 1px 2px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-md":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 2px 4px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-lg":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 4px 6px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-xl":
        "2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 8px 10px -1px hsl(255 86% 66% / 0.20)",
      "--shadow-2xl": "2px 2px 4px 0px hsl(255 86% 66% / 0.50)",
    },

    radius: "0.625rem",
  },

  bubblegum: {
    name: "bubblegum",
    label: "Bubblegum",
    light: {
      "--background": "oklch(0.9399 0.0203 345.6985)",
      "--foreground": "oklch(0.4712 0 0)",
      "--card": "oklch(0.9498 0.0500 86.8891)",
      "--card-foreground": "oklch(0.4712 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.4712 0 0)",
      "--primary": "oklch(0.6209 0.1801 348.1385)",
      "--primary-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.8095 0.0694 198.1863)",
      "--secondary-foreground": "oklch(0.3211 0 0)",
      "--muted": "oklch(0.88 0.0504 212.0952)",
      "--muted-foreground": "oklch(0.5795 0 0)",
      "--accent": "oklch(0.9195 0.0801 87.667)",
      "--accent-foreground": "oklch(0.3211 0 0)",
      "--destructive": "oklch(0.7091 0.1697 21.9551)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.6209 0.1801 348.1385)",
      "--input": "oklch(0.9189 0 0)",
      "--ring": "oklch(0.7002 0.1597 350.7532)",
      "--chart-1": "oklch(0.7002 0.1597 350.7532)",
      "--chart-2": "oklch(0.8189 0.0799 212.0892)",
      "--chart-3": "oklch(0.9195 0.0801 87.667)",
      "--chart-4": "oklch(0.7998 0.111 348.1791)",
      "--chart-5": "oklch(0.6197 0.1899 353.9091)",
      "--sidebar": "oklch(0.914 0.0424 343.0913)",
      "--sidebar-foreground": "oklch(0.3211 0 0)",
      "--sidebar-primary": "oklch(0.6559 0.2118 354.3084)",
      "--sidebar-primary-foreground": "oklch(1 0 0)",
      "--sidebar-accent": "oklch(0.8228 0.1095 346.0184)",
      "--sidebar-accent-foreground": "oklch(0.3211 0 0)",
      "--sidebar-border": "oklch(0.9464 0.0327 307.1745)",
      "--sidebar-ring": "oklch(0.6559 0.2118 354.3084)",

      "--font-sans": "var(--font-poppins), sans-serif",
      "--font-serif": "var(--font-lora), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      "--radius": "0.4rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      "--shadow-x": "3px",
      "--shadow-y": "3px",
      "--shadow-blur": "0px",
      "--shadow-spread": "0px",
      "--shadow-opacity": "1",
      "--shadow-color": "hsl(325.78 58.18% 56.86% / 0.5)",
      "--shadow-2xs": "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 0.5)",
      "--shadow-xs": "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 0.5)",
      "--shadow-sm":
        "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1), 3px 1px 2px -1px hsl(325.78 58.18% 56.86% / 1)",
      "--shadow":
        "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1), 3px 1px 2px -1px hsl(325.78 58.18% 56.86% / 1)",
      "--shadow-md":
        "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1), 3px 2px 4px -1px hsl(325.78 58.18% 56.86% / 1)",
      "--shadow-lg":
        "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1), 3px 4px 6px -1px hsl(325.78 58.18% 56.86% / 1)",
      "--shadow-xl":
        "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 1), 3px 8px 10px -1px hsl(325.78 58.18% 56.86% / 1)",
      "--shadow-2xl": "3px 3px 0px 0px hsl(325.78 58.18% 56.86% / 2.5)",
    },

    dark: {
      "--background": "oklch(0.2497 0.0305 234.1628)",
      "--foreground": "oklch(0.9306 0.0197 349.0785)",
      "--card": "oklch(0.2902 0.0299 233.5352)",
      "--card-foreground": "oklch(0.9306 0.0197 349.0785)",
      "--popover": "oklch(0.2902 0.0299 233.5352)",
      "--popover-foreground": "oklch(0.9306 0.0197 349.0785)",
      "--primary": "oklch(0.9195 0.0801 87.667)",
      "--primary-foreground": "oklch(0.2497 0.0305 234.1628)",
      "--secondary": "oklch(0.7794 0.0803 4.133)",
      "--secondary-foreground": "oklch(0.2497 0.0305 234.1628)",
      "--muted": "oklch(0.2713 0.0086 255.578)",
      "--muted-foreground": "oklch(0.7794 0.0803 4.133)",
      "--accent": "oklch(0.6699 0.0988 356.9762)",
      "--accent-foreground": "oklch(0.9306 0.0197 349.0785)",
      "--destructive": "oklch(0.6702 0.1806 350.3599)",
      "--destructive-foreground": "oklch(0.2497 0.0305 234.1628)",
      "--border": "oklch(0.3907 0.0399 242.2181)",
      "--input": "oklch(0.3093 0.0305 232.0027)",
      "--ring": "oklch(0.6998 0.0896 201.8672)",
      "--chart-1": "oklch(0.6998 0.0896 201.8672)",
      "--chart-2": "oklch(0.7794 0.0803 4.133)",
      "--chart-3": "oklch(0.6699 0.0988 356.9762)",
      "--chart-4": "oklch(0.4408 0.0702 217.0848)",
      "--chart-5": "oklch(0.2713 0.0086 255.578)",
      "--sidebar": "oklch(0.2303 0.027 235.9743)",
      "--sidebar-foreground": "oklch(0.967 0.0029 264.5419)",
      "--sidebar-primary": "oklch(0.6559 0.2118 354.3084)",
      "--sidebar-primary-foreground": "oklch(1 0 0)",
      "--sidebar-accent": "oklch(0.8228 0.1095 346.0184)",
      "--sidebar-accent-foreground": "oklch(0.2781 0.0296 256.848)",
      "--sidebar-border": "oklch(0.3729 0.0306 259.7328)",
      "--sidebar-ring": "oklch(0.6559 0.2118 354.3084)",

      "--font-sans": "var(--font-poppins), sans-serif",
      "--font-serif": "var(--font-lora), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      "--radius": "0.4rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      "--shadow-x": "3px",
      "--shadow-y": "3px",
      "--shadow-blur": "0px",
      "--shadow-spread": "0px",
      "--shadow-opacity": "1",
      "--shadow-color": "#324859",
      "--shadow-2xs": "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 0.5)",
      "--shadow-xs": "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 0.5)",
      "--shadow-sm":
        "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1), 3px 1px 2px -1px hsl(206.1538 28.0576% 27.2549% / 1)",
      "--shadow":
        "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1), 3px 1px 2px -1px hsl(206.1538 28.0576% 27.2549% / 1)",
      "--shadow-md":
        "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1), 3px 2px 4px -1px hsl(206.1538 28.0576% 27.2549% / 1)",
      "--shadow-lg":
        "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1), 3px 4px 6px -1px hsl(206.1538 28.0576% 27.2549% / 1)",
      "--shadow-xl":
        "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 1), 3px 8px 10px -1px hsl(206.1538 28.0576% 27.2549% / 1)",
      "--shadow-2xl": "3px 3px 0px 0px hsl(206.1538 28.0576% 27.2549% / 2.5)",
    },

    radius: DEFAULT_RADIUS,
  },

  caffeine: {
    name: "caffeine",
    label: "Caffeine",
    light: {
      "--background": "oklch(0.9821 0 0)",
      "--foreground": "oklch(0.2435 0 0)",
      "--card": "oklch(0.9911 0 0)",
      "--card-foreground": "oklch(0.2435 0 0)",
      "--popover": "oklch(0.9911 0 0)",
      "--popover-foreground": "oklch(0.2435 0 0)",
      "--primary": "oklch(0.4341 0.0392 41.9938)",
      "--primary-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.92 0.0651 74.3695)",
      "--secondary-foreground": "oklch(0.3499 0.0685 40.8288)",
      "--muted": "oklch(0.9521 0 0)",
      "--muted-foreground": "oklch(0.5032 0 0)",
      "--accent": "oklch(0.931 0 0)",
      "--accent-foreground": "oklch(0.2435 0 0)",
      "--destructive": "oklch(0.6271 0.1936 33.339)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.8822 0 0)",
      "--input": "oklch(0.8822 0 0)",
      "--ring": "oklch(0.4341 0.0392 41.9938)",
      "--chart-1": "oklch(0.4341 0.0392 41.9938)",
      "--chart-2": "oklch(0.92 0.0651 74.3695)",
      "--chart-3": "oklch(0.931 0 0)",
      "--chart-4": "oklch(0.9367 0.0523 75.5009)",
      "--chart-5": "oklch(0.4338 0.0437 41.6746)",
      "--sidebar": "oklch(0.9881 0 0)",
      "--sidebar-foreground": "oklch(0.2645 0 0)",
      "--sidebar-primary": "oklch(0.325 0 0)",
      "--sidebar-primary-foreground": "oklch(0.9881 0 0)",
      "--sidebar-accent": "oklch(0.9761 0 0)",
      "--sidebar-accent-foreground": "oklch(0.325 0 0)",
      "--sidebar-border": "oklch(0.9401 0 0)",
      "--sidebar-ring": "oklch(0.7731 0 0)",

      "--font-sans": "var(--font-roboto), sans-serif",
      "--font-serif": "var(--font-lora), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      "--radius": "0.5rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      "--shadow-x": "0",
      "--shadow-y": "1px",
      "--shadow-blur": "3px",
      "--shadow-spread": "0px",
      "--shadow-opacity": "0.1",
      "--shadow-color": "oklch(0 0 0)",
      "--shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
      "--shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
      "--shadow-sm":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
      "--shadow":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-md":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-lg":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-xl":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
    },

    dark: {
      "--background": "oklch(0.1776 0 0)",
      "--foreground": "oklch(0.9491 0 0)",
      "--card": "oklch(0.2134 0 0)",
      "--card-foreground": "oklch(0.9491 0 0)",
      "--popover": "oklch(0.2134 0 0)",
      "--popover-foreground": "oklch(0.9491 0 0)",
      "--primary": "oklch(0.9247 0.0524 66.1732)",
      "--primary-foreground": "oklch(0.2029 0.024 200.1962)",
      "--secondary": "oklch(0.3163 0.019 63.6992)",
      "--secondary-foreground": "oklch(0.9247 0.0524 66.1732)",
      "--muted": "oklch(0.252 0 0)",
      "--muted-foreground": "oklch(0.7699 0 0)",
      "--accent": "oklch(0.285 0 0)",
      "--accent-foreground": "oklch(0.9491 0 0)",
      "--destructive": "oklch(0.6271 0.1936 33.339)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.2351 0.0115 91.7467)",
      "--input": "oklch(0.4017 0 0)",
      "--ring": "oklch(0.9247 0.0524 66.1732)",
      "--chart-1": "oklch(0.9247 0.0524 66.1732)",
      "--chart-2": "oklch(0.3163 0.019 63.6992)",
      "--chart-3": "oklch(0.285 0 0)",
      "--chart-4": "oklch(0.3481 0.0219 67.0001)",
      "--chart-5": "oklch(0.9245 0.0533 67.0855)",
      "--sidebar": "oklch(0.2103 0.0059 285.8852)",
      "--sidebar-foreground": "oklch(0.9674 0.0013 286.3752)",
      "--sidebar-primary": "oklch(0.4882 0.2172 264.3763)",
      "--sidebar-primary-foreground": "oklch(1 0 0)",
      "--sidebar-accent": "oklch(0.2739 0.0055 286.0326)",
      "--sidebar-accent-foreground": "oklch(0.9674 0.0013 286.3752)",
      "--sidebar-border": "oklch(0.2739 0.0055 286.0326)",
      "--sidebar-ring": "oklch(0.8711 0.0055 286.286)",

      "--font-sans": "var(--font-roboto), sans-serif",
      "--font-serif": "var(--font-lora), serif",
      "--font-mono": "var(--font-fira-code), monospace",

      "--radius": "0.5rem",
      "--radius-sm": "calc(var(--radius) - 4px)",
      "--radius-md": "calc(var(--radius) - 2px)",
      "--radius-lg": "var(--radius)",
      "--radius-xl": "calc(var(--radius) + 4px)",

      "--spacing": "0.25rem",
      "--tracking-normal": "0em",

      "--shadow-x": "0",
      "--shadow-y": "1px",
      "--shadow-blur": "3px",
      "--shadow-spread": "0px",
      "--shadow-opacity": "0.1",
      "--shadow-color": "oklch(0 0 0)",
      "--shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
      "--shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
      "--shadow-sm":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
      "--shadow":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-md":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-lg":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-xl":
        "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
      "--shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
    },

    radius: DEFAULT_RADIUS,
  },
}

/** Convenience: get a preset by name, falling back to "default". */
export function getPreset(name: string): ThemePreset {
  return THEME_PRESETS[name] ?? THEME_PRESETS["default"]!
}

/** Export the default variables so the provider can use them as baseline. */
export { DEFAULT_LIGHT, DEFAULT_DARK, DEFAULT_RADIUS }
