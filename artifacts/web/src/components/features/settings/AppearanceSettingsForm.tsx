
import * as React from "react"
import { useTheme } from "next-themes"
import {
  Download,
  Monitor,
  Moon,
  Sun,
  Upload,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useColorTheme } from "@/context/ThemeProvider"
import { ThemeEditor } from "@/components/features/settings/ThemeEditor"
import { toast } from "sonner"
import type {
  AppearanceSettings,
  ColorTheme,
  ThemeVariables,
} from "@/types/settings-types"
import { COLOR_THEMES, THEME_VAR_KEYS } from "@/types/settings-types"

// ─── Mode options (data-driven; collapses the previously duplicated JSX) ────

type ThemeMode = "light" | "dark" | "system"

const MODE_OPTIONS: ReadonlyArray<{
  value: ThemeMode
  label: string
  icon: LucideIcon
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

// ─── Mode selector (light / dark / system) ──────────────────────────────────

// Hydration-safe "is mounted" detector. Using `useSyncExternalStore` avoids
// the React 19 `set-state-in-effect` warning that a `useState` + `useEffect`
// pattern produces, while still guaranteeing the server renders `false` and
// the client renders `true` after hydration.
const subscribeNoop = () => () => {}
const getMountedSnapshot = () => true
const getMountedServerSnapshot = () => false

function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribeNoop,
    getMountedSnapshot,
    getMountedServerSnapshot
  )
}

function ThemeModeField() {
  const { theme, setTheme } = useTheme()
  // next-themes resolves on the client only. Render a skeleton placeholder on
  // the server / pre-hydration pass to avoid a hydration mismatch.
  const mounted = useMounted()

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-4 pt-2">
        {MODE_OPTIONS.map((opt) => (
          <Skeleton key={opt.value} className="h-[92px] w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <RadioGroup
      value={theme}
      onValueChange={setTheme}
      className="grid grid-cols-3 gap-4 pt-2"
    >
      {MODE_OPTIONS.map(({ value, label, icon: Icon }) => {
        const id = `theme-${value}`
        const isActive = theme === value
        return (
          <Field key={value}>
            <RadioGroupItem value={value} id={id} className="sr-only" />
            <FieldLabel
              htmlFor={id}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 hover:bg-accent",
                isActive ? "border-primary bg-primary/5" : "border-transparent"
              )}
            >
              <Icon className="size-6" />
              {label}
            </FieldLabel>
          </Field>
        )
      })}
    </RadioGroup>
  )
}

// ─── Page form ──────────────────────────────────────────────────────────────

export function AppearanceSettingsForm() {
  const {
    isDirty,
    isSaving,
    save,
    reset,
    colorTheme,
    light,
    dark,
    radius,
    importTheme,
  } = useColorTheme()

  // ── Export handler ──────────────────────────────────────────────────────
  const handleExport = React.useCallback(() => {
    const payload = {
      version: 1 as const,
      colorTheme,
      light,
      dark,
      radius,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "high6-theme.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Theme exported")
  }, [colorTheme, light, dark, radius])

  // ── Import handler ──────────────────────────────────────────────────────
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImport = React.useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      // Reset input so the same file can be re-imported
      e.target.value = ""

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const raw = JSON.parse(event.target?.result as string)

          // 1. Must be a valid object
          if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
            toast.error("Invalid file: expected a JSON object.")
            return
          }

          // 2. Version check
          if (raw.version !== 1) {
            toast.error("Unsupported file version. Expected version 1.")
            return
          }

          // 3. colorTheme must be a valid ColorTheme
          if (!COLOR_THEMES.includes(raw.colorTheme as ColorTheme)) {
            toast.error(
              `Invalid colorTheme: "${raw.colorTheme}". Must be one of: ${COLOR_THEMES.join(", ")}`
            )
            return
          }

          // 4. If light/dark exist, verify they contain at least the color keys
          const colorKeys = THEME_VAR_KEYS.filter(
            (k) =>
              k.startsWith("--background") ||
              k.startsWith("--primary") ||
              k.startsWith("--secondary") ||
              k.startsWith("--accent") ||
              k.startsWith("--muted") ||
              k.startsWith("--destructive") ||
              k.startsWith("--border") ||
              k.startsWith("--input") ||
              k.startsWith("--ring")
          ) as Array<keyof ThemeVariables>

          for (const mode of ["light", "dark"] as const) {
            const vars = raw[mode]
            if (vars !== undefined) {
              if (
                typeof vars !== "object" ||
                vars === null ||
                Array.isArray(vars)
              ) {
                toast.error(`Invalid ${mode} object: must be a key-value map.`)
                return
              }
              const missing = colorKeys.filter((k) => !(k in vars))
              if (missing.length > 5) {
                toast.error(
                  `Incomplete ${mode} variables: missing ${missing.length} required color keys.`
                )
                return
              }
            }
          }

          // 5. Build the settings and apply
          const settings: AppearanceSettings = {
            colorTheme: raw.colorTheme,
            ...(raw.light ? { light: raw.light as ThemeVariables } : {}),
            ...(raw.dark ? { dark: raw.dark as ThemeVariables } : {}),
            ...(raw.radius ? { radius: String(raw.radius) } : {}),
          }

          importTheme(settings)
          toast.success("Theme imported — preview applied. Save to persist.")
        } catch {
          toast.error("Failed to parse file. Make sure it's valid JSON.")
        }
      }
      reader.readAsText(file)
    },
    [importTheme]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend variant="label">Mode</FieldLegend>
            <FieldDescription>
              Select your preferred color mode for the interface.
            </FieldDescription>
            <ThemeModeField />
          </FieldSet>

          <FieldSeparator />

          <ThemeEditor />

          <FieldSeparator />

          <FieldSet>
            <FieldLegend variant="label">Import / Export</FieldLegend>
            <FieldDescription>
              Export your current theme as a JSON file, or import one to preview
              it. Import applies as a preview — you still need to Save to
              persist.
            </FieldDescription>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport()}
              >
                <Download />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload />
                Import
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </FieldSet>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={() => void save()} disabled={!isDirty || isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
        <Button
          variant="outline"
          onClick={reset}
          disabled={!isDirty || isSaving}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
