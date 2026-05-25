import type { Request, Response, NextFunction } from "express"
import { DepartmentsService } from "../services/DepartmentsService.js"
import {
  departmentSchema,
  listDepartmentsQuerySchema,
} from "../validators/departments.js"
import { fail, failValidation, ok, okPage } from "../lib/responses.js"

export const DepartmentsController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listDepartmentsQuerySchema.safeParse(req.query)
      if (!parsed.success) return failValidation(res, parsed.error)
      const result = await DepartmentsService.list(parsed.data)
      return okPage(res, result)
    } catch (err) {
      next(err)
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const department = await DepartmentsService.find(String(req.params.id))
      if (!department) return fail(res, "Department not found", 404)
      return ok(res, department)
    } catch (err) {
      next(err)
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = departmentSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      const department = await DepartmentsService.create(parsed.data)
      return ok(res, department, 201)
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = departmentSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      const department = await DepartmentsService.update(
        String(req.params.id),
        parsed.data
      )
      if (!department) return fail(res, "Department not found", 404)
      return ok(res, department)
    } catch (err) {
      next(err)
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const department = await DepartmentsService.archive(String(req.params.id))
      if (!department) return fail(res, "Department not found", 404)
      return ok(res, department)
    } catch (err) {
      next(err)
    }
  },
}
