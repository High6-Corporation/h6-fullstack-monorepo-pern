
import * as React from "react"
import { UploadIcon, FileIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface FileUploadProps {
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
}

/**
 * File upload component with a drop zone for documents.
 *
 * Features:
 * - Drag & drop + click to upload
 * - File type and size validation
 * - Shows uploaded file name with remove button
 * - Loading and error states
 *
 * @example
 * <FileUpload
 *   value={docPath}
 *   onChange={setDocPath}
 *   onUpload={async (file) => {
 *     const formData = new FormData()
 *     formData.append("file", file)
 *     return await uploadDocAction(formData)
 *   }}
 *   accept=".pdf,application/pdf"
 * />
 */
export function FileUpload({
  value,
  onChange,
  onUpload,
  accept = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxSizeMB = 10,
  className,
  disabled = false,
  label = "Document",
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const allowedExtensions = React.useMemo(
    () =>
      accept
        .split(",")
        .filter((t) => t.startsWith("."))
        .map((t) => t.slice(1).toUpperCase()),
    [accept]
  )

  const acceptedFormatsHint = React.useMemo(() => {
    const exts =
      allowedExtensions.length > 0 ? allowedExtensions.join(", ") : "PDF, DOCX"
    return `${exts} up to ${maxSizeMB} MB`
  }, [allowedExtensions, maxSizeMB])

  // Extract filename from path
  const fileName = value ? (value.split("/").pop() ?? value) : null

  async function handleFile(file: File) {
    setError(null)

    if (file.size > maxSizeBytes) {
      setError(`File must be under ${maxSizeMB} MB`)
      return
    }

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (
      allowedExtensions.length > 0 &&
      !allowedExtensions.map((e) => e.toLowerCase()).includes(ext)
    ) {
      setError(`Only ${allowedExtensions.join(", ")} files are allowed`)
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
          "group/zone relative cursor-pointer rounded-lg border-2 transition-colors",
          // Empty state
          !value &&
            "border-dashed border-muted-foreground/25 p-6 hover:border-muted-foreground/40 hover:bg-muted/50",
          // Filled state
          value && "border-solid border-border p-3",
          // Dragging state
          isDragging && "border-primary/50 bg-primary/5",
          // Disabled
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {value && fileName ? (
          <div className="flex items-center gap-3">
            <FileIcon className="h-8 w-8 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">Uploaded</p>
            </div>
            {!disabled && (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/zone:opacity-100">
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
                  Change
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={handleRemove}
                >
                  <TrashIcon className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <UploadIcon className="size-6" />
            <span className="text-sm font-medium">
              {isDragging ? "Drop file here" : "Click or drag to upload"}
            </span>
          </div>
        )}

        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
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
