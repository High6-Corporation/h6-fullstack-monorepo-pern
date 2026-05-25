import { writeFile, mkdir } from "fs/promises"
import { join, resolve } from "path"
import { z } from "zod"

const IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
] as const
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "svg", "ico"] as const
const IMAGE_MAX = 2 * 1024 * 1024

const DOC_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const
const DOC_EXTS = ["pdf", "docx"] as const
const DOC_MAX = 10 * 1024 * 1024

export interface UploadFile {
  originalname: string
  mimetype: string
  size: number
  buffer: Buffer
}

const validationFailure = z.ZodError

export class UploadService {
  /**
   * Local starter storage.
   *
   * Production/Replit note: replace `save()` with Replit Object Storage or an
   * approved object storage provider before storing client files at scale.
   * Keep the same validation rules and return only safe public/private URLs.
   */
  static UPLOAD_ROOT = resolve(
    process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads")
  )

  static validateImage(file: UploadFile | undefined) {
    if (!file) throw new Error("No file provided")
    if (file.size <= 0) throw new ValidationError({ file: ["File is empty"] })
    if (file.size > IMAGE_MAX)
      throw new ValidationError({ file: ["File must be under 2 MB"] })
    if (!IMAGE_TYPES.includes(file.mimetype as (typeof IMAGE_TYPES)[number]))
      throw new ValidationError({
        file: ["Only PNG, JPEG, WebP, SVG, and ICO files are allowed"],
      })
    const ext = (file.originalname.split(".").pop() ?? "").toLowerCase()
    if (!IMAGE_EXTS.includes(ext as (typeof IMAGE_EXTS)[number]))
      throw new ValidationError({ file: ["File extension not allowed"] })
  }

  static validateDocument(file: UploadFile | undefined) {
    if (!file) throw new Error("No file provided")
    if (file.size <= 0) throw new ValidationError({ file: ["File is empty"] })
    if (file.size > DOC_MAX)
      throw new ValidationError({ file: ["File must be under 10 MB"] })
    if (!DOC_TYPES.includes(file.mimetype as (typeof DOC_TYPES)[number]))
      throw new ValidationError({
        file: ["Only PDF and DOCX files are allowed"],
      })
    const ext = (file.originalname.split(".").pop() ?? "").toLowerCase()
    if (!DOC_EXTS.includes(ext as (typeof DOC_EXTS)[number]))
      throw new ValidationError({ file: ["File extension not allowed"] })
  }

  static sanitizeSvg(buffer: Buffer): Buffer {
    const text = buffer.toString("utf8").toLowerCase()
    if (/<script[\s>]/.test(text) || /\bon\w+\s*=/.test(text)) {
      throw new ValidationError({
        file: ["SVG contains unsafe content (scripts or event handlers)"],
      })
    }
    return buffer
  }

  static async save(
    file: UploadFile,
    prefix: "logo" | "icon" | "avatar" | "manual"
  ): Promise<string> {
    const ext = (file.originalname.split(".").pop() ?? "bin").toLowerCase()
    const filename = `${prefix}-${Date.now()}.${ext.replace(/[^a-z0-9]/g, "")}`
    const target = join(this.UPLOAD_ROOT, filename)
    if (!resolve(target).startsWith(this.UPLOAD_ROOT)) {
      throw new Error("Invalid file path")
    }
    await mkdir(this.UPLOAD_ROOT, { recursive: true })
    const buffer =
      file.mimetype === "image/svg+xml" ? this.sanitizeSvg(file.buffer) : file.buffer
    await writeFile(target, buffer)
    return `/uploads/${filename}`
  }
}

export class ValidationError extends Error {
  errors: Record<string, string[]>
  constructor(errors: Record<string, string[]>) {
    super("Validation error")
    this.errors = errors
  }
}
