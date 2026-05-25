import type { Request, Response, NextFunction } from "express"
import { updateUser, getUser } from "@workspace/db/queries/users"
import {
  changePassword,
  getSecuritySettings,
} from "@workspace/db/queries/account"
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/account.js"
import { ok, fail, failValidation } from "../lib/responses.js"

export const AccountController = {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getUser(req.auth!.userId!)
      if (!user) return fail(res, "Not found", 404)
      return ok(res, user)
    } catch (err) {
      next(err)
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateProfileSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      const user = await updateUser(req.auth!.userId!, parsed.data)
      return ok(res, user)
    } catch (err) {
      next(err)
    }
  },

  async security(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await getSecuritySettings()
      return ok(res, settings)
    } catch (err) {
      next(err)
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = changePasswordSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      try {
        await changePassword(req.auth!.userId!, {
          currentPassword: parsed.data.currentPassword,
          newPassword: parsed.data.newPassword,
        })
      } catch (err) {
        if (
          err instanceof Error &&
          err.message === "Current password is incorrect"
        ) {
          return res.status(422).json({
            success: false,
            errors: { currentPassword: [err.message] },
          })
        }
        throw err
      }
      return ok(res, { updated: true })
    } catch (err) {
      next(err)
    }
  },
}
