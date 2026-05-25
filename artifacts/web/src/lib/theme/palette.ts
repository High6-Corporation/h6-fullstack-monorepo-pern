import { converter, parse, type Oklch } from "culori"
import type { ThemeVariables } from "@/types/settings-types"

export const toOklch = converter("oklch")

// ─── Hex validation ─────────────────────────────────────────────────────────

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value)
}

/**
 * Convert HEX → OKLCH (object + CSS string)
 * Uses existing `parse` + `toOklch` pipeline for consistency.
 */
export function hexToOklch(hex: string): string {
  if (!isValidHex(hex)) return "oklch(0.5 0 0)"

  const parsed = parse(hex)
  if (!parsed) return "oklch(0.5 0 0)"

  const color = toOklch(parsed) as Oklch
  if (!color) return "oklch(0.5 0 0)"

  const l = color.l ?? 0
  const c = color.c ?? 0
  const h = color.h ?? 0

  return `oklch(${round(l)} ${round(c)} ${round(h)})`
}

// ─── CSS generation ─────────────────────────────────────────────────────────

/**
 * Generate a `<style>`-injectable CSS string from full theme variable maps.
 *
 * Produces two selector blocks:
 *   [data-theme="<themeName>"]  { --var: value; ... }
 *   .dark[data-theme="<themeName>"]  { --var: value; ... }
 *
 * Plus an optional `--radius` override in the light block.
 */
export function themeToCss(
  light: ThemeVariables,
  dark: ThemeVariables,
  themeName: string = "custom",
  radius?: string
): string {
  const block = (
    sel: string,
    vars: ThemeVariables,
    extra?: Record<string, string>
  ) => {
    const allVars: Record<string, string> = { ...vars }
    if (extra) Object.assign(allVars, extra)
    return `${sel}{${Object.entries(allVars)
      .map(([k, v]) => `${k}:${v};`)
      .join("")}}`
  }

  const extraRadius = radius ? { "--radius": radius } : undefined

  return (
    block(`[data-theme="${themeName}"]`, light, extraRadius) +
    block(`.dark[data-theme="${themeName}"]`, dark, extraRadius)
  )
}

// ─── Legacy: single-hex accent palette generation ───────────────────────────
// Kept for backward compatibility with the old customColor flow.

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function oklchStr(l: number, c: number, h: number) {
  return `oklch(${round(l)} ${round(c)} ${round(h)})`
}

function round(n: number) {
  return Math.round(n * 1000) / 1000
}

export interface GeneratedPalette {
  light: Record<string, string>
  dark: Record<string, string>
}

/**
 * Turn a hex value into a full shadcn-compatible accent palette.
 * Only the accent-related tokens are generated — neutral tokens inherit
 * from :root / .dark.
 */
export function generatePalette(hex: string): GeneratedPalette {
  const parsed = parse(hex)
  if (!parsed) throw new Error(`Invalid color: ${hex}`)
  const seed = toOklch(parsed) as Oklch
  const l = seed.l ?? 0.6
  const c = seed.c ?? 0.15
  const h = seed.h ?? 0

  const fgLight =
    l < 0.7 ? oklchStr(0.98, 0.01, h) : oklchStr(0.25, Math.min(c, 0.08), h)
  const fgDark = fgLight

  const primaryL = oklchStr(l, c, h)
  const darkLift = clamp(l + 0.05, 0.35, 0.8)
  const primaryD = oklchStr(darkLift, c, h)

  const charts = (base: number) => ({
    "--chart-1": oklchStr(base, c, h),
    "--chart-2": oklchStr(
      clamp(base + 0.07, 0.2, 0.95),
      clamp(c - 0.05, 0, 1),
      h
    ),
    "--chart-3": oklchStr(clamp(base - 0.06, 0.2, 0.95), c, h),
    "--chart-4": oklchStr(
      clamp(base + 0.14, 0.2, 0.95),
      clamp(c - 0.08, 0, 1),
      h
    ),
    "--chart-5": oklchStr(
      clamp(base + 0.21, 0.2, 0.98),
      clamp(c - 0.12, 0, 1),
      h
    ),
  })

  return {
    light: {
      "--primary": primaryL,
      "--primary-foreground": fgLight,
      "--ring": primaryL,
      "--sidebar-primary": primaryL,
      "--sidebar-primary-foreground": fgLight,
      "--sidebar-ring": primaryL,
      ...charts(l),
    },
    dark: {
      "--primary": primaryD,
      "--primary-foreground": fgDark,
      "--ring": primaryD,
      "--sidebar-primary": primaryD,
      "--sidebar-primary-foreground": fgDark,
      "--sidebar-ring": primaryD,
      ...charts(darkLift),
    },
  }
}

/** @deprecated Use themeToCss() with full ThemeVariables instead. */
export function paletteToCss(palette: GeneratedPalette): string {
  const block = (sel: string, vars: Record<string, string>) =>
    `${sel}{${Object.entries(vars)
      .map(([k, v]) => `${k}:${v};`)
      .join("")}}`

  return (
    block('[data-theme="custom"]', palette.light) +
    block('.dark[data-theme="custom"]', palette.dark)
  )
}

/** @deprecated Use themeToCss() with full ThemeVariables instead. */
export function customColorToCss(hex: string | undefined | null): string {
  if (!hex || !isValidHex(hex)) return ""
  try {
    return paletteToCss(generatePalette(hex))
  } catch {
    return ""
  }
}

// ─── Hex → ThemeVariables ───────────────────────────────────────────────────
// Given a single hex seed, produce a *full* ThemeVariables by merging
// the generated accent tokens over the default baseline.

import { DEFAULT_LIGHT, DEFAULT_DARK } from "@/lib/theme/registry"

export function hexToThemeVars(hex: string): {
  light: ThemeVariables
  dark: ThemeVariables
} {
  const palette = generatePalette(hex)
  return {
    light: { ...DEFAULT_LIGHT, ...(palette.light as Partial<ThemeVariables>) },
    dark: { ...DEFAULT_DARK, ...(palette.dark as Partial<ThemeVariables>) },
  }
}
