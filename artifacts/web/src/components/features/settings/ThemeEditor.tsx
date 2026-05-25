
import * as React from "react"
import { useTheme } from "next-themes"
import { Check, ChevronDown } from "lucide-react"
import { useColorTheme } from "@/context/ThemeProvider"
import type { ColorTheme, ThemeVariables } from "@/types/settings-types"
import { THEME_PRESETS } from "@/lib/theme/registry"
import { GOOGLE_FONT_OPTIONS, categoryFor } from "@/lib/theme/fonts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// ─── Variable groups for the collapsible sections ───────────────────────────

interface VarGroup {
  label: string
  keys: Array<keyof ThemeVariables>
}

const COLOR_GROUPS: VarGroup[] = [
  {
    label: "Base",
    keys: ["--background", "--foreground"],
  },
  {
    label: "Primary",
    keys: ["--primary", "--primary-foreground"],
  },
  {
    label: "Secondary",
    keys: ["--secondary", "--secondary-foreground"],
  },
  {
    label: "Accent",
    keys: ["--accent", "--accent-foreground"],
  },
  {
    label: "Muted",
    keys: ["--muted", "--muted-foreground"],
  },
  {
    label: "Card",
    keys: ["--card", "--card-foreground"],
  },
  {
    label: "Popover",
    keys: ["--popover", "--popover-foreground"],
  },
  {
    label: "Destructive",
    keys: ["--destructive"],
  },
  {
    label: "Border & Input",
    keys: ["--border", "--input", "--ring"],
  },
  {
    label: "Chart",
    keys: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"],
  },
  {
    label: "Sidebar",
    keys: [
      "--sidebar",
      "--sidebar-foreground",
      "--sidebar-primary",
      "--sidebar-primary-foreground",
      "--sidebar-accent",
      "--sidebar-accent-foreground",
      "--sidebar-border",
      "--sidebar-ring",
    ],
  },
]

/** Shadow numeric parameters that work as sliders. */
const SHADOW_SLIDER_PARAMS: Array<{
  key: keyof ThemeVariables
  label: string
  min: number
  max: number
  step: number
  unit: string
  toSlider: (v: string) => number
  fromSlider: (n: number) => string
}> = [
  {
    key: "--shadow-x",
    label: "X offset",
    min: -20,
    max: 20,
    step: 1,
    unit: "px",
    toSlider: (v) => parseFloat(v) || 0,
    fromSlider: (n) => `${n}px`,
  },
  {
    key: "--shadow-y",
    label: "Y offset",
    min: -20,
    max: 20,
    step: 1,
    unit: "px",
    toSlider: (v) => parseFloat(v) || 0,
    fromSlider: (n) => `${n}px`,
  },
  {
    key: "--shadow-blur",
    label: "Blur",
    min: 0,
    max: 50,
    step: 1,
    unit: "px",
    toSlider: (v) => parseFloat(v) || 0,
    fromSlider: (n) => `${n}px`,
  },
  {
    key: "--shadow-spread",
    label: "Spread",
    min: -20,
    max: 20,
    step: 1,
    unit: "px",
    toSlider: (v) => parseFloat(v) || 0,
    fromSlider: (n) => `${n}px`,
  },
  {
    key: "--shadow-opacity",
    label: "Opacity",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
    toSlider: (v) => Math.round((parseFloat(v) || 0) * 100),
    fromSlider: (n) => (n / 100).toFixed(2),
  },
]

/** Every collapsible group across all tabs — used to seed `openGroups`. */
const ALL_GROUPS: VarGroup[] = [...COLOR_GROUPS]

/** Font variables are always applied to BOTH light and dark modes. */
const FONT_KEYS: Array<keyof ThemeVariables> = [
  "--font-sans",
  "--font-serif",
  "--font-mono",
]

/** Friendly labels for the font category rows. */
const FONT_LABELS: Record<string, { title: string; description: string }> = {
  "--font-sans": {
    title: "Sans Serif",
    description: "UI, headings, and body text",
  },
  "--font-serif": {
    title: "Serif",
    description: "Decorative and long-form content",
  },
  "--font-mono": {
    title: "Monospace",
    description: "Code blocks and technical text",
  },
}

/** Friendly label for a CSS variable key. */
function varLabel(key: keyof ThemeVariables): string {
  return key.replace(/^--/, "").replace(/-/g, " ")
}

// ─── Hex conversion utility ────────────────────────────────────────────────

/** Attempt to parse an oklch/hex/rgb value into something the native color picker can use. */
function toHexValue(cssValue: string): string {
  // If already a hex, return as-is
  if (/^#[0-9a-fA-F]{6}$/.test(cssValue)) return cssValue
  if (/^#[0-9a-fA-F]{3}$/.test(cssValue)) {
    // Expand shorthand hex
    return `#${cssValue[1]}${cssValue[1]}${cssValue[2]}${cssValue[2]}${cssValue[3]}${cssValue[3]}`
  }

  // Use canvas to convert: draw a pixel with the color, read it back as RGB
  if (typeof document === "undefined") return "#888888"
  try {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return "#888888"

    // Strip oklch alpha modifier (e.g. "oklch(1 0 0 / 10%)") —
    // the native picker doesn't support alpha, and canvas may reject the value.
    const stripped = cssValue.replace(/\s*\/\s*[\d.]+%?\s*\)/, ")")

    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = stripped
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

    // If all zero, the color likely failed to parse
    if (
      r === 0 &&
      g === 0 &&
      b === 0 &&
      !stripped.includes("0 0 0") &&
      !stripped.includes("#000")
    ) {
      return "#888888"
    }

    const hex = (n: number) => n.toString(16).padStart(2, "0")
    return `#${hex(r)}${hex(g)}${hex(b)}`
  } catch {
    return "#888888"
  }
}

// ─── Preset list for the picker ─────────────────────────────────────────────

const PRESET_NAMES = Object.keys(THEME_PRESETS) as string[]

// ─── ThemeEditor component ─────────────────────────────────────────────────

export function ThemeEditor() {
  const {
    colorTheme,
    light,
    dark,
    radius,
    setColorTheme,
    setVariable,
    setRadius,
  } = useColorTheme()

  const { resolvedTheme } = useTheme()
  // Track mount state to avoid hydration mismatch
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    // Mark as mounted after hydration
    const timer = requestAnimationFrame(() => {
      setIsMounted(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  // Use light variables as the SSR default to avoid hydration mismatch.
  // After mount, switch to the actual resolved mode.
  const mode = (isMounted && resolvedTheme === "dark" ? "dark" : "light") as
    | "light"
    | "dark"
  const activeVars = mode === "dark" ? dark : light

  // Preset picker open state
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Edit both modes toggle
  const [editBothModes, setEditBothModes] = React.useState(false)

  // Collapsible open states — initialize ALL groups to prevent controlled/uncontrolled warning
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      for (const group of ALL_GROUPS) {
        // Only Base starts open
        initial[group.label] = group.label === "Base"
      }
      return initial
    }
  )

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  // Radius slider: convert rem to a 0-100 number for the slider
  const radiusNum = parseFloat(radius) || 0
  const radiusSliderValue = Math.round(radiusNum * 100) // 0–150 range (0–1.5rem)

  // Helper: handles a single variable change, respecting "edit both" toggle.
  const applyVariable = React.useCallback(
    (key: keyof ThemeVariables, val: string) => {
      if (editBothModes) {
        setVariable("light", key, val)
        setVariable("dark", key, val)
      } else {
        setVariable(mode, key, val)
      }
    },
    [editBothModes, mode, setVariable]
  )

  // Helper: always applies to BOTH modes (radius, spacing, shadows, typography).
  const applyBoth = React.useCallback(
    (key: keyof ThemeVariables, val: string) => {
      setVariable("light", key, val)
      setVariable("dark", key, val)
    },
    [setVariable]
  )

  // Renders one collapsible variable group. Shared across every tab.
  const renderGroup = (group: VarGroup) => (
    <Collapsible
      key={group.label}
      open={openGroups[group.label]}
      onOpenChange={() => toggleGroup(group.label)}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-accent">
        <span className="flex items-center gap-2">
          <span className="flex gap-0.5">
            {group.keys.slice(0, 4).map((key) => (
              <span
                key={key}
                className="size-3 rounded-xs border border-border/50"
                style={{ backgroundColor: activeVars[key] }}
              />
            ))}
          </span>
          {group.label}
        </span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            openGroups[group.label] && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-2 px-2 pb-2">
          {group.keys.map((key) => (
            <VariableRow
              key={key}
              varKey={key}
              label={varLabel(key)}
              value={activeVars[key]}
              onChange={(val) => applyVariable(key, val)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )

  return (
    <div className="space-y-8">
      {/* ── Theme Picker ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Theme</Label>
        <p className="text-sm text-muted-foreground">
          Choose a prebuilt theme or customize individual colors below.
        </p>
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="size-4 rounded-full border"
                  style={{ backgroundColor: activeVars["--primary"] }}
                />
                {colorTheme === "custom"
                  ? "Custom"
                  : (THEME_PRESETS[colorTheme]?.label ?? "Default")}
              </span>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search themes..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No theme found.</CommandEmpty>
                <CommandGroup>
                  {PRESET_NAMES.filter((name) => {
                    if (!search) return true
                    return THEME_PRESETS[name]!.label.toLowerCase().includes(
                      search.toLowerCase()
                    )
                  }).map((name) => {
                    const preset = THEME_PRESETS[name]!
                    const isActive =
                      colorTheme === name ||
                      (name === "default" && colorTheme === "default")
                    return (
                      <CommandItem
                        key={name}
                        value={name}
                        onSelect={() => {
                          setColorTheme(name as ColorTheme)
                          setPickerOpen(false)
                        }}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="size-4 shrink-0 rounded-full border"
                          style={{
                            backgroundColor: preset.light["--primary"],
                          }}
                        />
                        <span className="flex-1">{preset.label}</span>
                        {isActive && <Check className="size-4" />}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* ── Mode toggle ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Label className="text-sm">
          Editing: <span className="capitalize">{mode}</span> mode
        </Label>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="edit-both-modes"
            className="text-xs text-muted-foreground"
          >
            Edit both
          </Label>
          <Switch
            id="edit-both-modes"
            checked={editBothModes}
            onCheckedChange={setEditBothModes}
          />
        </div>
      </div>

      {/* ── Tabbed sections (Colors / Typography / Other) ─────────────── */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        {/* Colors tab — every color-related variable group */}
        <TabsContent value="colors" className="mt-4 space-y-6">
          <div className="space-y-1">{COLOR_GROUPS.map(renderGroup)}</div>
          <LivePreview />
        </TabsContent>

        {/* Typography tab — font pickers + letter spacing */}
        <TabsContent value="typography" className="mt-4 space-y-6">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Fonts</Label>
              <p className="text-xs text-muted-foreground">
                Applied to both light & dark modes.
              </p>
            </div>
            <div className="space-y-2 rounded-lg border bg-card/50 p-3">
              {FONT_KEYS.map((key) => {
                const meta = FONT_LABELS[key as string]
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-32 shrink-0">
                      <div className="text-xs font-medium">{meta?.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {meta?.description}
                      </div>
                    </div>
                    <div className="flex-1">
                      <FontPicker
                        value={activeVars[key]}
                        category={categoryFor(key as string)!}
                        onChange={(val) => {
                          // Fonts always sync across both modes
                          setVariable("light", key, val)
                          setVariable("dark", key, val)
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Letter spacing</Label>
              <span className="font-mono text-sm text-muted-foreground">
                {activeVars["--tracking-normal"]}
              </span>
            </div>
            <Slider
              value={[
                Math.round(
                  (parseFloat(activeVars["--tracking-normal"]) || 0) * 1000
                ),
              ]}
              min={-5}
              max={50}
              step={1}
              onValueChange={([v]) => {
                applyBoth("--tracking-normal", `${(v / 1000).toFixed(3)}em`)
              }}
            />
            <div className="flex gap-2">
              {["0em", "0.01em", "0.025em", "0.05em"].map((t) => (
                <Button
                  key={t}
                  variant={
                    activeVars["--tracking-normal"] === t
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => applyBoth("--tracking-normal", t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <FontPreview />
        </TabsContent>

        {/* Other tab — radius, spacing, shadows */}
        <TabsContent value="other" className="mt-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Radius</Label>
              <span className="text-sm text-muted-foreground">{radius}</span>
            </div>
            <Slider
              value={[radiusSliderValue]}
              min={0}
              max={150}
              step={5}
              onValueChange={([v]) => {
                setRadius((v / 100).toFixed(2) + "rem")
              }}
            />
            <div className="flex gap-2">
              {["0rem", "0.3rem", "0.45rem", "0.75rem", "1rem"].map((r) => (
                <Button
                  key={r}
                  variant={radius === r ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setRadius(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Spacing</Label>
              <span className="text-sm text-muted-foreground">
                {activeVars["--spacing"]}
              </span>
            </div>
            <Slider
              value={[parseFloat(activeVars["--spacing"]) * 100 || 25]}
              min={5}
              max={50}
              step={5}
              onValueChange={([v]) => {
                applyBoth("--spacing", `${(v / 100).toFixed(2)}rem`)
              }}
            />
            <div className="flex gap-2">
              {["0.15rem", "0.25rem", "0.35rem", "0.5rem"].map((s) => (
                <Button
                  key={s}
                  variant={
                    activeVars["--spacing"] === s ? "default" : "outline"
                  }
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => applyBoth("--spacing", s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Shadows</Label>
              <p className="text-xs text-muted-foreground">
                Adjust the base shadow dimensions and opacity.
              </p>
            </div>
            <div className="space-y-4 rounded-lg border bg-card/50 p-3">
              {SHADOW_SLIDER_PARAMS.map((param) => (
                <div key={param.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {param.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {activeVars[param.key]}
                    </span>
                  </div>
                  <Slider
                    value={[param.toSlider(activeVars[param.key])]}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    onValueChange={([v]) => {
                      applyBoth(param.key, param.fromSlider(v))
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Variable Row ───────────────────────────────────────────────────────────

function VariableRow({
  varKey,
  label,
  value,
  onChange,
}: {
  varKey: keyof ThemeVariables
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const fontCategory = categoryFor(varKey as string)

  // ── Font variable: render tweakcn-style searchable font picker ──────────
  if (fontCategory) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-28 shrink-0 text-xs text-muted-foreground">
          {label}
        </span>
        <FontPicker value={value} category={fontCategory} onChange={onChange} />
      </div>
    )
  }

  // ── Color variable: render color picker + text input ────────────────────
  const hexForPicker = toHexValue(value)

  return (
    <div className="flex items-center gap-2">
      <label
        className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded border"
        style={{ backgroundColor: value }}
        aria-label={`Pick color for ${label}`}
      >
        <input
          type="color"
          value={hexForPicker}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 flex-1 font-mono text-xs"
      />
    </div>
  )
}

// ─── FontPicker (tweakcn-style searchable font dropdown) ───────────────────

function FontPicker({
  value,
  category,
  onChange,
}: {
  value: string
  category: "sans" | "serif" | "mono"
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  const options = React.useMemo(
    () => GOOGLE_FONT_OPTIONS.filter((f) => f.category === category),
    [category]
  )

  // Normalize matching: the registry may store fonts as bare names ("Geist"),
  // CSS family strings ("Geist, sans-serif"), or CSS var references
  // ("var(--font-geist), sans-serif"). Match by extracting the font name
  // from the CSS var in each option's value.
  const current = React.useMemo(() => {
    // Try exact match first
    const exact = options.find((o) => o.value === value)
    if (exact) return exact
    // Fuzzy: extract the CSS var name and see if value contains the font label
    const lowerValue = value.toLowerCase().replace(/["']/g, "")
    return options.find((o) => {
      const varName = o.value.match(/var\(--([^)]+)\)/)?.[1] // e.g. "font-geist"
      if (varName) {
        // Convert "font-geist" → "geist" and check if value contains it
        const fontId = varName.replace(/^font-/, "")
        return lowerValue.includes(fontId)
      }
      // Also try matching by label
      return lowerValue.includes(o.label.toLowerCase())
    })
  }, [options, value])

  const isSelected = (opt: (typeof options)[number]) =>
    opt.value === value || opt === current

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-7 flex-1 justify-between px-2 text-xs"
        >
          <span
            className="truncate"
            style={{ fontFamily: current?.preview ?? value }}
          >
            {current?.label ?? value}
          </span>
          <ChevronDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search fonts..." className="h-9" />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup
              heading={
                category === "sans"
                  ? "Sans Serif"
                  : category === "serif"
                    ? "Serif"
                    : "Monospace"
              }
            >
              {options.map((opt) => (
                <CommandItem
                  key={opt.label}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <span
                    className="truncate text-sm"
                    style={{ fontFamily: opt.preview }}
                  >
                    {opt.label}
                  </span>
                  {isSelected(opt) && <Check className="size-4 shrink-0" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ─── Live Preview ───────────────────────────────────────────────────────────

function LivePreview() {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h4 className="text-sm font-medium">Preview</h4>

      <div className="space-y-3">
        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="destructive">
            Destructive
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>

        {/* Input */}
        <Input placeholder="Type something..." className="h-8 text-sm" />

        {/* Color swatches */}
        <div className="flex gap-1">
          {[
            "--primary",
            "--secondary",
            "--accent",
            "--muted",
            "--destructive",
          ].map((key) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <span
                className="size-8 rounded-md border"
                style={{
                  backgroundColor: `var(${key})`,
                }}
              />
              <span className="text-[10px] text-muted-foreground">
                {key.replace(/^--/, "")}
              </span>
            </div>
          ))}
        </div>

        {/* Chart colors */}
        <div className="flex gap-1">
          {[
            "--chart-1",
            "--chart-2",
            "--chart-3",
            "--chart-4",
            "--chart-5",
          ].map((key) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <span
                className="size-8 rounded-md border"
                style={{ backgroundColor: `var(${key})` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {key.replace(/^--/, "")}
              </span>
            </div>
          ))}
        </div>

        {/* Radius preview */}
        <div className="flex items-center gap-2">
          <div
            className="size-8 border-2 border-primary"
            style={{ borderRadius: "var(--radius)" }}
          />
          <span className="text-xs text-muted-foreground">
            Border radius: var(--radius)
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Font Preview ────────────────────────────────────────────────────────────

const FONT_SECTIONS = [
  {
    title: "Sans-serif (UI & Headings)",
    fontClass: "font-sans",
    render: () => (
      <>
        <h4 className="mb-2 text-xl font-bold">Heading Example</h4>
        <p className="mb-2">
          This is body text using your selected sans-serif font.
        </p>
        <p>Another paragraph to demonstrate line spacing and readability.</p>
      </>
    ),
  },
  {
    title: "Serif (Decorative & Content)",
    fontClass: "font-serif",
    render: () => (
      <>
        <p className="mb-2 text-lg italic">
          &ldquo;This is a quote using your selected serif font.&rdquo;
        </p>
        <p className="mb-2">
          Serif fonts are often used for longer content blocks and decorative
          elements.
        </p>
        <p>
          They provide a classic, elegant appearance for content-focused
          sections.
        </p>
      </>
    ),
  },
  {
    title: "Monospace (Code & Technical)",
    fontClass: "font-mono",
    render: () => (
      <>
        <pre className="mb-2 rounded bg-muted/50 p-3 text-sm">
          <code>{`function example() {\n  console.log("This is monospace code");\n  return true;\n}`}</code>
        </pre>
        <p className="text-sm">
          Inline code:{" "}
          <code className="rounded bg-muted px-1">const x = 42;</code>
        </p>
      </>
    ),
  },
] as const

function FontPreview() {
  return (
    <div className="space-y-6">
      {FONT_SECTIONS.map(({ title, fontClass, render }) => (
        <div key={title}>
          <h3 className="mb-2 text-sm font-semibold">{title}</h3>
          <div className={cn("rounded-lg border bg-muted/50 p-4", fontClass)}>
            {render()}
          </div>
        </div>
      ))}
    </div>
  )
}
