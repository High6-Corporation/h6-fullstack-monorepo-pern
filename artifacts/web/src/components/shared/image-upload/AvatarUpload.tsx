
import * as React from "react"
import { Image } from "@/components/shared/Image"
import { CameraIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  value: string
  onChange: (value: string) => void
  onUpload: (
    file: File
  ) => Promise<{ success: boolean; path?: string; error?: string }>
  accept?: string
  maxSizeMB?: number
  className?: string
  disabled?: boolean
  /** Fallback text shown when no image is set (e.g. user initials). */
  fallback?: string
}

/**
 * Circular avatar upload component.
 *
 * Features:
 * - Click to open file picker
 * - Circular image preview
 * - Camera icon overlay on hover
 * - Loading state with spinner
 * - Error state
 *
 * @example
 * <AvatarUpload
 *   value={avatar}
 *   onChange={setAvatar}
 *   onUpload={async (file) => {
 *     const formData = new FormData()
 *     formData.append("file", file)
 *     return await uploadAvatarFileAction(formData)
 *   }}
 *   fallback="JD"
 * />
 */
export function AvatarUpload({
  value,
  onChange,
  onUpload,
  accept = "image/png,image/jpeg,image/webp",
  maxSizeMB = 2,
  className,
  disabled = false,
  fallback,
}: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const allowedTypes = React.useMemo(
    () => accept.split(",").map((t) => t.trim()),
    [accept]
  )

  async function handleFile(file: File) {
    setError(null)

    if (file.size > maxSizeBytes) {
      setError(`File must be under ${maxSizeMB} MB`)
      return
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPEG, and WebP files are allowed")
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <button
        type="button"
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group/avatar relative flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-colors",
          value
            ? "border-border"
            : "border-dashed border-muted-foreground/25 hover:border-muted-foreground/40",
          disabled && "pointer-events-none opacity-50"
        )}
        aria-label={value ? "Change avatar" : "Upload avatar"}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="80px"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/avatar:opacity-100">
              <CameraIcon className="size-5 text-white" />
            </div>
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-0.5 bg-muted text-muted-foreground">
            {fallback ? (
              <span className="text-sm font-semibold">{fallback}</span>
            ) : (
              <>
                <CameraIcon className="size-5" />
                <span className="text-[9px] leading-none">Upload</span>
              </>
            )}
          </div>
        )}

        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Spinner className="size-5" />
          </div>
        )}
      </button>

      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Hint */}
      {!error && (
        <p className="text-xs text-muted-foreground">
          PNG, JPEG, or WebP. Max {maxSizeMB} MB.
        </p>
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
