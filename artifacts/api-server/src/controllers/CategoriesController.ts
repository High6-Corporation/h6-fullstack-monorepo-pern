import type { Request, Response, NextFunction } from "express"
import { CategoriesService } from "../services/CategoriesService"
import {
    categorySchema,
    listCategoriesQuerySchema,
} from "../validators/categories"
import { fail, failValidation, ok, okPage } from "../lib/responses.js"

export const CategoriesController = {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = listCategoriesQuerySchema.safeParse(req.query)
            if (!parsed.success) return failValidation(res, parsed.error)
            const categories = await CategoriesService.list(parsed.data)
            return okPage(res, categories)
        } catch (err) {
            next(err)
        }
    },

    async show(req: Request, res: Response, next: NextFunction) {
        try {
            // No validation needed - just use the id from params
            const category = await CategoriesService.find(String(req.params.id))
            if (!category) return fail(res, "Category not found")
            return ok(res, category)
        } catch (err) {
            next(err)
        }
    },

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = categorySchema.safeParse(req.body)
            if (!parsed.success) return failValidation(res, parsed.error)
            const category = await CategoriesService.create(parsed.data)
            return ok(res, category)
        } catch (err) {
            next(err)
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = categorySchema.safeParse(req.body)
            if (!parsed.success) return failValidation(res, parsed.error)
            const category = await CategoriesService.update(String(req.params.id), parsed.data)
            if (!category) return fail(res, "Category not found");
            return ok(res, category)
        } catch (err) {
            next(err)
        }
    },

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await CategoriesService.archive(String(req.params.id))
            if (!category) return fail(res, "Category not found");
            return ok(res, category)
        } catch (err) {
            next(err)
        }
    },
}
