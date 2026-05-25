import type { Request, Response, NextFunction } from "express"
import {
  getGeneralSettings,
  updateGeneralSettings,
  getAppearanceSettings,
  updateAppearanceSettings,
  getNotificationsSettings,
  updateNotificationsSettings,
  getHelpCenterSettings,
  updateHelpCenterSettings,
} from "@workspace/db/queries/settings"
import {
  generalSettingsSchema,
  notificationsSchema,
  helpCenterSchema,
  appearanceSchema,
} from "../validators/settings.js"
import { ok, failValidation } from "../lib/responses.js"

export const SettingsController = {
  async general(_req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await getGeneralSettings())
    } catch (err) {
      next(err)
    }
  },
  async updateGeneral(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = generalSettingsSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      await updateGeneralSettings(parsed.data)
      return ok(res, await getGeneralSettings())
    } catch (err) {
      next(err)
    }
  },
  async appearance(_req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await getAppearanceSettings())
    } catch (err) {
      next(err)
    }
  },
  async updateAppearance(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = appearanceSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      await updateAppearanceSettings(
        parsed.data as Parameters<typeof updateAppearanceSettings>[0]
      )
      return ok(res, await getAppearanceSettings())
    } catch (err) {
      next(err)
    }
  },
  async notifications(_req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await getNotificationsSettings())
    } catch (err) {
      next(err)
    }
  },
  async updateNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = notificationsSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      await updateNotificationsSettings(parsed.data)
      return ok(res, await getNotificationsSettings())
    } catch (err) {
      next(err)
    }
  },
  async helpCenter(_req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await getHelpCenterSettings())
    } catch (err) {
      next(err)
    }
  },
  async updateHelpCenter(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = helpCenterSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      await updateHelpCenterSettings(parsed.data)
      return ok(res, await getHelpCenterSettings())
    } catch (err) {
      next(err)
    }
  },
}
