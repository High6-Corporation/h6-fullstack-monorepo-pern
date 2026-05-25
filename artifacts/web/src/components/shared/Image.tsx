import type { ComponentPropsWithoutRef } from "react"

/**
 * Minimal drop-in shim for the `next/image` API used throughout the app.
 * Strips Next-specific props (`priority`, `unoptimized`, `quality`, `fill`,
 * `loader`, etc.) and renders a plain `<img>` so the existing component
 * markup keeps working under Vite.
 */
type NextImageProps = Omit<ComponentPropsWithoutRef<"img">, "width" | "height"> & {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  priority?: boolean
  unoptimized?: boolean
  quality?: number
  fill?: boolean
  loader?: unknown
  placeholder?: string
  blurDataURL?: string
}

export function Image({
  priority: _priority,
  unoptimized: _unoptimized,
  quality: _quality,
  fill: _fill,
  loader: _loader,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...rest
}: NextImageProps) {
  return <img loading={_priority ? "eager" : "lazy"} decoding="async" {...rest} />
}

export default Image
