import { z } from "zod/v4"

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  status: z.enum(["published", "draft"]),
  userId: z.string().min(1, "Author is required"),
})

export const listPostsQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["published", "draft"]).optional(),
  userId: z.string().optional(),
  sort: z.string().optional(),
  dir: z.enum(["asc", "desc"]).optional(),
})

export type PostInput = z.infer<typeof postSchema>
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>
