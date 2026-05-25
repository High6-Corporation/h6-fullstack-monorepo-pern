import type { Request, Response, NextFunction } from "express"
import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@workspace/db/queries/users"
import {
  createUserSchema,
  updateUserSchema,
  listUsersQuerySchema,
} from "../validators/users.js"
import { ok, okPage, fail, failValidation } from "../lib/responses.js"

export const UsersController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listUsersQuerySchema.safeParse(req.query)
      if (!parsed.success) return failValidation(res, parsed.error)
      const result = await getUsers(parsed.data)
      return okPage(res, result)
    } catch (err) {
      next(err)
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getUser(String(req.params.id))
      if (!user) return fail(res, "User not found", 404)
      return ok(res, user)
    } catch (err) {
      next(err)
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createUserSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      const user = await createUser(parsed.data)
      return ok(res, user, 201)
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateUserSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      const user = await updateUser(String(req.params.id), parsed.data)
      return ok(res, user)
    } catch (err) {
      next(err)
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteUser(String(req.params.id))
      return ok(res, { id: String(req.params.id) })
    } catch (err) {
      next(err)
    }
  },
}
