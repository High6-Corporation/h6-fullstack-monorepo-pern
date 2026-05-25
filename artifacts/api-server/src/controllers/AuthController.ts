import type { Request, Response, NextFunction } from "express"
import { getUser } from "@workspace/db/queries/users"
import { ok, fail } from "../lib/responses.js"

export const AuthController = {
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.userId) return fail(res, "Not authenticated", 401)
      const user = await getUser(req.auth.userId)
      if (!user) return fail(res, "Not authenticated", 401)
      return ok(res, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        avatar: user.avatar,
        contactNumber: user.contactNumber,
      })
    } catch (err) {
      next(err)
    }
  },
}
