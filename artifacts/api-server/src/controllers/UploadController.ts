import type { Request, Response, NextFunction } from "express"
import {
  UploadService,
  ValidationError,
  type UploadFile,
} from "../services/UploadService.js"
import {
  getGeneralSettings,
  updateGeneralSettings,
} from "@workspace/db/queries/settings"
import { ok, fail } from "../lib/responses.js"

function file(req: Request): UploadFile | undefined {
  // multer single("file")
  return (req as any).file as UploadFile | undefined
}

function handle(
  validate: "image" | "document",
  prefix: "logo" | "icon" | "avatar" | "manual",
  after?: (path: string) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const f = file(req)
      if (validate === "image") UploadService.validateImage(f)
      else UploadService.validateDocument(f)
      const path = await UploadService.save(f!, prefix)
      if (after) await after(path)
      return ok(res, { path })
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(422).json({ success: false, errors: err.errors })
      }
      if (err instanceof Error && err.message === "No file provided") {
        return fail(res, err.message, 400)
      }
      next(err)
    }
  }
}

export const UploadController = {
  appLogo: handle("image", "logo", async (path) => {
    const current = await getGeneralSettings()
    await updateGeneralSettings({ ...current, appLogo: path })
  }),
  appIcon: handle("image", "icon", async (path) => {
    const current = await getGeneralSettings()
    await updateGeneralSettings({ ...current, appIcon: path })
  }),
  avatar: handle("image", "avatar"),
  userManual: handle("document", "manual"),
}
