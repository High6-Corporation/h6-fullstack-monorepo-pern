import type { Request, Response, NextFunction } from "express"
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "@workspace/db/queries/posts"
import { postSchema, listPostsQuerySchema } from "../validators/posts.js"
import { ok, okPage, fail, failValidation } from "../lib/responses.js"

export const PostsController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listPostsQuerySchema.safeParse(req.query)
      if (!parsed.success) return failValidation(res, parsed.error)
      const result = await getPosts(parsed.data)
      return okPage(res, result)
    } catch (err) {
      next(err)
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await getPost(String(req.params.id))
      if (!post) return fail(res, "Post not found", 404)
      return ok(res, post)
    } catch (err) {
      next(err)
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = postSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      const post = await createPost(parsed.data)
      return ok(res, post, 201)
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = postSchema.safeParse(req.body)
      if (!parsed.success) return failValidation(res, parsed.error)
      const post = await updatePost(String(req.params.id), parsed.data)
      return ok(res, post)
    } catch (err) {
      next(err)
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      await deletePost(String(req.params.id))
      return ok(res, { id: String(req.params.id) })
    } catch (err) {
      next(err)
    }
  },
}
