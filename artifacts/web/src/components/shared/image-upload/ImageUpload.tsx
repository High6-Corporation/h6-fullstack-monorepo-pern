
import * as React from "react"
import { Image } from "@/components/shared/Image"
import { UploadIcon, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type AspectRatio = "landscape" | "square" | "portrait"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  onUpload: (
    file: File
  ) => Promise<{ success: boolean; path?: string; error?: string }>
  accept?: string
  maxSizeMB?: number
  className?: string
  disabled?: boolean
  label?: string
  /** Controls the zone aspect ratio. "landscape" = wide, "square" = even, "portrait" = tall. */
  aspect?: AspectRatio
}

const aspectStyles: Record<AspectRatio, string> = {
  landscape: "w-72 h-40",
  square: "w-40 h-40",
  portrait: "w-40 h-56",
}

/**
 * Image upload component with a unified drop zone.
 *
 * Features:
 * - Drag & drop + click to upload
 * - File type and size validation
 * - Image preview filling the zone
 * - Hover overlay with Change / Remove actions
 * - Loading and error states
 * - Configurable aspect ratio (landscape, square, portrait)
 *
 * @example
 * <ImageUpload
 *   value={logo}
 *   onChange={setLogo}
 *   onUpload={async (file) => {
 *     const formData = new FormData()
 *     formData.append("file", file)
 *     return await uploadLogoAction(formData)
 *   }}
 *   aspect="landscape"
 * />
 */
export function ImageUpload({
  value,
  onChange,
  onUpload,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  maxSizeMB = 2,
  className,
  disabled = false,
  label = "Image",
  aspect = "landscape",
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const allowedTypes = React.useMemo(
    () => accept.split(",").map((t) => t.trim()),
    [accept]
  )

  const acceptedFormatsHint = React.useMemo(() => {
    const extensions = allowedTypes
      .map((t) => t.replace("image/", "").toUpperCase())
      .join(", ")
      .replace("X-ICON", "ICO")
      .replace("VND.MICROSOFT.ICON", "ICO")
      .replace("SVG+XML", "SVG")
    return `${extensions} up to ${maxSizeMB} MB`
  }, [allowedTypes, maxSizeMB])

  async function handleFile(file: File) {
    setError(null)

    if (file.size > maxSizeBytes) {
      setError(`File must be under ${maxSizeMB} MB`)
      return
    }

    if (!allowedTypes.includes(file.type)) {
      setError(`Only ${acceptedFormatsHint.split(" up")[0]} files are allowed`)
      return
    }

    setIsUploading(true)
    try {
      const result = await onUpload(file)
      if (result.success && result.path) {
        onChange(result.path)
      } else {
        setError(result.error ?? "Upload failed")
      }
    } catch {
      setError("Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only unset if leaving the zone itself (not entering a child)
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragging(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    onChange("")
    setError(null)
  }

  function handleZoneClick() {
    if (!disabled && !isUploading) inputRef.current?.click()
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={value ? `Change ${label}` : `Upload ${label}`}
        onClick={handleZoneClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleZoneClick()
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "group/zone relative cursor-pointer overflow-hidden rounded-lg border-2 transition-colors",
          aspectStyles[aspect],
          // Empty state
          !value &&
            "border-dashed border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/50",
          // Filled state
          value && "border-solid border-border",
          // Dragging state
          isDragging && "border-primary/50 bg-primary/5",
          // Disabled
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {value ? (
          <>
            {/* Preview */}
            <Image
              src={value}
              alt={`${label} preview`}
              fill
              className="object-contain p-2"
              sizes="280px"
            />
            {/* Hover overlay */}
            {!disabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover/zone:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation()
                    inputRef.current?.click()
                  }}
                >
                  <PencilIcon className="size-3.5" />
                  Change
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-white hover:bg-white/20 hover:text-white"
                  onClick={handleRemove}
                >
                  <TrashIcon className="size-3.5" />
                  Remove
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="flex size-full flex-col items-center justify-center gap-1.5 px-4 text-muted-foreground">
            <UploadIcon className="size-6" />
            <span className="text-sm font-medium">
              {isDragging ? "Drop image here" : "Click or drag to upload"}
            </span>
          </div>
        )}

        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Spinner className="size-6" />
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Hint */}
      {!error && (
        <p className="text-xs text-muted-foreground">{acceptedFormatsHint}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
