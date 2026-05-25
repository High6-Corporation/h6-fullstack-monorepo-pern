/**
 * Vite-compatible Google Fonts registry.
 *
 * In the Next.js version this file used `next/font/google` to self-host
 * fonts at build time. Under Vite we load the same families via the Google
 * Fonts CDN (see <link> tag in index.html) and just declare the same set
 * of CSS variables / metadata that the theme editor relies on.
 */

interface GoogleFont {
  variable: string
  family: string
}

function font(variable: string, family: string): GoogleFont {
  return { variable, family }
}

// --- Sans-serif ----------------------------------------------------------
export const inter = font("--font-inter", "Inter")
export const geist = font("--font-geist", "Geist")
export const plusJakartaSans = font("--font-plus-jakarta-sans", "Plus Jakarta Sans")
export const dmSans = font("--font-dm-sans", "DM Sans")
export const spaceGrotesk = font("--font-space-grotesk", "Space Grotesk")
export const roboto = font("--font-roboto", "Roboto")
export const montserrat = font("--font-montserrat", "Montserrat")
export const poppins = font("--font-poppins", "Poppins")
export const openSans = font("--font-open-sans", "Open Sans")
export const outfit = font("--font-outfit", "Outfit")
export const workSans = font("--font-work-sans", "Work Sans")
export const nunito = font("--font-nunito", "Nunito")
export const raleway = font("--font-raleway", "Raleway")
export const manrope = font("--font-manrope", "Manrope")
export const figtree = font("--font-figtree", "Figtree")
export const karla = font("--font-karla", "Karla")
export const archivo = font("--font-archivo", "Archivo")
export const redHatDisplay = font("--font-red-hat-display", "Red Hat Display")
export const lexend = font("--font-lexend", "Lexend")

// --- Serif ----------------------------------------------------------------
export const lora = font("--font-lora", "Lora")
export const playfairDisplay = font("--font-playfair-display", "Playfair Display")
export const merriweather = font("--font-merriweather", "Merriweather")
export const robotoSerif = font("--font-roboto-serif", "Roboto Serif")
export const ebGaramond = font("--font-eb-garamond", "EB Garamond")
export const libreBaskerville = font("--font-libre-baskerville", "Libre Baskerville")
export const sourceSerif4 = font("--font-source-serif-4", "Source Serif 4")
export const bitter = font("--font-bitter", "Bitter")
export const cormorantGaramond = font("--font-cormorant-garamond", "Cormorant Garamond")
export const notoSerif = font("--font-noto-serif", "Noto Serif")
export const ptSerif = font("--font-pt-serif", "PT Serif")
export const vollkorn = font("--font-vollkorn", "Vollkorn")

// --- Monospace -----------------------------------------------------------
export const geistMono = font("--font-geist-mono", "Geist Mono")
export const robotoMono = font("--font-roboto-mono", "Roboto Mono")
export const firaCode = font("--font-fira-code", "Fira Code")
export const jetbrainsMono = font("--font-jetbrains-mono", "JetBrains Mono")
export const sourceCodePro = font("--font-source-code-pro", "Source Code Pro")
export const ibmPlexMono = font("--font-ibm-plex-mono", "IBM Plex Mono")
export const spaceMono = font("--font-space-mono", "Space Mono")
export const dmMono = font("--font-dm-mono", "DM Mono")
export const ubuntuMono = font("--font-ubuntu-mono", "Ubuntu Mono")
export const redHatMono = font("--font-red-hat-mono", "Red Hat Mono")

export interface GoogleFontOption {
  label: string
  value: string
  preview: string
  category: "sans" | "serif" | "mono"
}

function opt(
  label: string,
  variable: string,
  category: "sans" | "serif" | "mono"
): GoogleFontOption {
  const fallback = category === "mono" ? "monospace" : category
  const value = `var(${variable}), ${fallback}`
  return { label, value, preview: value, category }
}

export const GOOGLE_FONT_OPTIONS: readonly GoogleFontOption[] = [
  opt("Inter", "--font-inter", "sans"),
  opt("Geist", "--font-geist", "sans"),
  opt("Plus Jakarta Sans", "--font-plus-jakarta-sans", "sans"),
  opt("DM Sans", "--font-dm-sans", "sans"),
  opt("Space Grotesk", "--font-space-grotesk", "sans"),
  opt("Roboto", "--font-roboto", "sans"),
  opt("Montserrat", "--font-montserrat", "sans"),
  opt("Poppins", "--font-poppins", "sans"),
  opt("Open Sans", "--font-open-sans", "sans"),
  opt("Outfit", "--font-outfit", "sans"),
  opt("Work Sans", "--font-work-sans", "sans"),
  opt("Nunito", "--font-nunito", "sans"),
  opt("Raleway", "--font-raleway", "sans"),
  opt("Manrope", "--font-manrope", "sans"),
  opt("Figtree", "--font-figtree", "sans"),
  opt("Karla", "--font-karla", "sans"),
  opt("Archivo", "--font-archivo", "sans"),
  opt("Red Hat Display", "--font-red-hat-display", "sans"),
  opt("Lexend", "--font-lexend", "sans"),
  opt("Lora", "--font-lora", "serif"),
  opt("Playfair Display", "--font-playfair-display", "serif"),
  opt("Merriweather", "--font-merriweather", "serif"),
  opt("Roboto Serif", "--font-roboto-serif", "serif"),
  opt("EB Garamond", "--font-eb-garamond", "serif"),
  opt("Libre Baskerville", "--font-libre-baskerville", "serif"),
  opt("Source Serif 4", "--font-source-serif-4", "serif"),
  opt("Bitter", "--font-bitter", "serif"),
  opt("Cormorant Garamond", "--font-cormorant-garamond", "serif"),
  opt("Noto Serif", "--font-noto-serif", "serif"),
  opt("PT Serif", "--font-pt-serif", "serif"),
  opt("Vollkorn", "--font-vollkorn", "serif"),
  opt("Geist Mono", "--font-geist-mono", "mono"),
  opt("Roboto Mono", "--font-roboto-mono", "mono"),
  opt("Fira Code", "--font-fira-code", "mono"),
  opt("JetBrains Mono", "--font-jetbrains-mono", "mono"),
  opt("Source Code Pro", "--font-source-code-pro", "mono"),
  opt("IBM Plex Mono", "--font-ibm-plex-mono", "mono"),
  opt("Space Mono", "--font-space-mono", "mono"),
  opt("DM Mono", "--font-dm-mono", "mono"),
  opt("Ubuntu Mono", "--font-ubuntu-mono", "mono"),
  opt("Red Hat Mono", "--font-red-hat-mono", "mono"),
] as const

export const ALL_FONTS = [
  inter, geist, plusJakartaSans, dmSans, spaceGrotesk, roboto, montserrat,
  poppins, openSans, outfit, workSans, nunito, raleway, manrope, figtree,
  karla, archivo, redHatDisplay, lexend, lora, playfairDisplay, merriweather,
  robotoSerif, ebGaramond, libreBaskerville, sourceSerif4, bitter,
  cormorantGaramond, notoSerif, ptSerif, vollkorn, geistMono, robotoMono,
  firaCode, jetbrainsMono, sourceCodePro, ibmPlexMono, spaceMono, dmMono,
  ubuntuMono, redHatMono,
] as const

export const ALL_FONT_VARIABLES = ""

export function categoryFor(
  variableKey: string
): "sans" | "serif" | "mono" | null {
  if (variableKey === "--font-sans") return "sans"
  if (variableKey === "--font-serif") return "serif"
  if (variableKey === "--font-mono") return "mono"
  return null
}
