import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { toast } from "sonner"
import { updateColorThemeAction } from "@/actions/appearance-actions"
import { useAppearanceSettings } from "@/lib/api/settings"
import type {
  AppearanceSettings,
  ColorTheme,
  ThemeVariables,
} from "@/types/settings-types"
import { THEME_VAR_KEYS } from "@/types/settings-types"
import {
  getPreset,
  DEFAULT_LIGHT,
  DEFAULT_DARK,
  DEFAULT_RADIUS,
} from "@/lib/theme/registry"
import { themeToCss, hexToThemeVars, isValidHex } from "@/lib/theme/palette"

interface ColorThemeContextValue {
  colorTheme: ColorTheme
  light: ThemeVariables
  dark: ThemeVariables
  radius: string
  setColorTheme: (value: ColorTheme) => void
  setVariable: (
    mode: "light" | "dark",
    key: keyof ThemeVariables,
    value: string
  ) => void
  setRadius: (value: string) => void
  isDirty: boolean
  isSaving: boolean
  save: () => Promise<void>
  reset: () => void
  importTheme: (settings: AppearanceSettings) => void
}

const ColorThemeContext = React.createContext<ColorThemeContextValue | null>(
  null
)

function applyDataAttribute(value: ColorTheme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (value === "default") {
    root.removeAttribute("data-theme")
  } else {
    root.setAttribute("data-theme", value)
  }
}

function varsEqual(a: ThemeVariables, b: ThemeVariables): boolean {
  for (const key of THEME_VAR_KEYS) {
    if (a[key] !== b[key]) return false
  }
  return true
}

function resolveInitialVars(
  initialSettings: Partial<AppearanceSettings> | undefined
): {
  colorTheme: ColorTheme
  light: ThemeVariables
  dark: ThemeVariables
  radius: string
} {
  const colorTheme = initialSettings?.colorTheme ?? "default"
  const radius = initialSettings?.radius ?? DEFAULT_RADIUS

  if (initialSettings?.light && initialSettings?.dark) {
    return {
      colorTheme,
      light: { ...DEFAULT_LIGHT, ...initialSettings.light },
      dark: { ...DEFAULT_DARK, ...initialSettings.dark },
      radius,
    }
  }
  if (
    colorTheme === "custom" &&
    initialSettings?.customColor &&
    isValidHex(initialSettings.customColor)
  ) {
    const vars = hexToThemeVars(initialSettings.customColor)
    return { colorTheme: "custom", ...vars, radius }
  }
  const preset = getPreset(colorTheme)
  return {
    colorTheme,
    light: { ...preset.light },
    dark: { ...preset.dark },
    radius: preset.radius,
  }
}

function ColorThemeProvider({
  initialSettings,
  children,
}: {
  initialSettings?: AppearanceSettings
  children: React.ReactNode
}) {
  const resolved = React.useMemo(
    () => resolveInitialVars(initialSettings),
    [initialSettings]
  )

  const [colorTheme, setColorThemeState] = React.useState<ColorTheme>(
    resolved.colorTheme
  )
  const [light, setLight] = React.useState<ThemeVariables>(resolved.light)
  const [dark, setDark] = React.useState<ThemeVariables>(resolved.dark)
  const [radius, setRadiusState] = React.useState<string>(resolved.radius)

  const [savedColorTheme, setSavedColorTheme] = React.useState<ColorTheme>(
    resolved.colorTheme
  )
  const [savedLight, setSavedLight] = React.useState<ThemeVariables>(
    resolved.light
  )
  const [savedDark, setSavedDark] = React.useState<ThemeVariables>(resolved.dark)
  const [savedRadius, setSavedRadius] = React.useState<string>(resolved.radius)

  const [isSaving, setIsSaving] = React.useState(false)

  // Re-seed once we receive initial settings asynchronously.
  const seededRef = React.useRef(false)
  React.useEffect(() => {
    if (seededRef.current) return
    if (!initialSettings) return
    seededRef.current = true
    setColorThemeState(resolved.colorTheme)
    setLight(resolved.light)
    setDark(resolved.dark)
    setRadiusState(resolved.radius)
    setSavedColorTheme(resolved.colorTheme)
    setSavedLight(resolved.light)
    setSavedDark(resolved.dark)
    setSavedRadius(resolved.radius)
  }, [initialSettings, resolved])

  React.useEffect(() => {
    applyDataAttribute(colorTheme)
  }, [colorTheme])

  const customCss = React.useMemo(() => {
    if (colorTheme === "default") return ""
    return themeToCss(light, dark, colorTheme, radius)
  }, [colorTheme, light, dark, radius])

  const isDirty =
    colorTheme !== savedColorTheme ||
    !varsEqual(light, savedLight) ||
    !varsEqual(dark, savedDark) ||
    radius !== savedRadius

  const setColorTheme = React.useCallback((next: ColorTheme) => {
    if (next === "custom") {
      setColorThemeState("custom")
      return
    }
    const preset = getPreset(next)
    setColorThemeState(next)
    setLight({ ...preset.light })
    setDark({ ...preset.dark })
    setRadiusState(preset.radius)
  }, [])

  const setVariable = React.useCallback(
    (mode: "light" | "dark", key: keyof ThemeVariables, value: string) => {
      setColorThemeState((prev) => (prev === "custom" ? prev : "custom"))
      if (mode === "light") {
        setLight((prev) => ({ ...prev, [key]: value }))
      } else {
        setDark((prev) => ({ ...prev, [key]: value }))
      }
    },
    []
  )

  const setRadius = React.useCallback((value: string) => {
    setColorThemeState((prev) => (prev === "custom" ? prev : "custom"))
    setRadiusState(value)
  }, [])

  const save = React.useCallback(async () => {
    setIsSaving(true)
    try {
      const payload: AppearanceSettings = { colorTheme, light, dark, radius }
      const result = await updateColorThemeAction(payload)
      if (!result.success) {
        toast.error(result.error ?? "Failed to save theme")
        return
      }
      setSavedColorTheme(colorTheme)
      setSavedLight(light)
      setSavedDark(dark)
      setSavedRadius(radius)
      toast.success("Theme saved")
    } catch {
      toast.error("Failed to save theme")
    } finally {
      setIsSaving(false)
    }
  }, [colorTheme, light, dark, radius])

  const reset = React.useCallback(() => {
    setColorThemeState(savedColorTheme)
    setLight(savedLight)
    setDark(savedDark)
    setRadiusState(savedRadius)
  }, [savedColorTheme, savedLight, savedDark, savedRadius])

  const importTheme = React.useCallback(
    (settings: AppearanceSettings) => {
      if (
        settings.colorTheme !== "custom" &&
        !settings.light &&
        !settings.dark
      ) {
        setColorTheme(settings.colorTheme)
        if (settings.radius) setRadiusState(settings.radius)
        return
      }
      const theme =
        settings.light && settings.dark ? "custom" : settings.colorTheme
      setColorThemeState(theme)
      if (settings.light) setLight({ ...DEFAULT_LIGHT, ...settings.light })
      if (settings.dark) setDark({ ...DEFAULT_DARK, ...settings.dark })
      if (settings.radius) setRadiusState(settings.radius)
    },
    [setColorTheme]
  )

  const value = React.useMemo<ColorThemeContextValue>(
    () => ({
      colorTheme, light, dark, radius,
      setColorTheme, setVariable, setRadius,
      isDirty, isSaving, save, reset, importTheme,
    }),
    [colorTheme, light, dark, radius, setColorTheme, setVariable, setRadius,
      isDirty, isSaving, save, reset, importTheme]
  )

  return (
    <ColorThemeContext.Provider value={value}>
      {customCss && (
        <style
          id="theme-palette"
          dangerouslySetInnerHTML={{ __html: customCss }}
        />
      )}
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const ctx = React.useContext(ColorThemeContext)
  if (!ctx) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider")
  }
  return ctx
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key == null || event.key.toLowerCase() !== "d") return
      const t = event.target
      if (t instanceof HTMLElement) {
        if (
          t.isContentEditable ||
          t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT"
        ) {
          return
        }
      }
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resolvedTheme, setTheme])
  return null
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch initial appearance settings from the API (best-effort, public).
  const { data } = useAppearanceSettings()

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ColorThemeProvider initialSettings={data}>
        <ThemeHotkey />
        {children}
      </ColorThemeProvider>
    </NextThemesProvider>
  )
}
