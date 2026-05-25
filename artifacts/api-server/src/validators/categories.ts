import { z } from "zod"

const emptyToNull = (v: unknown) =>
  v && typeof v === "string" && v.trim().length > 0 ? v.trim() : null

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").transform((v) => v.trim()),
  description: z.string().transform(emptyToNull),
  isActive: z.boolean().default(true),
})

export const listCategoriesQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  isActive: z
  .enum(["true", "false"])
  .optional()
  .transform((value) => (value === undefined ? undefined : value === "true")),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>
