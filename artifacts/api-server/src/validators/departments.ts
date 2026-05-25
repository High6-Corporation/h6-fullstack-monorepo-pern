import { z } from "zod"

const emptyToNull = (v: unknown) =>
  v && typeof v === "string" && v.trim().length > 0 ? v.trim() : null

export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().optional().nullable().transform(emptyToNull),
  isActive: z.boolean().optional().default(true),
})

export const listDepartmentsQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
})

export type DepartmentInput = z.infer<typeof departmentSchema>
export type ListDepartmentsQuery = z.infer<typeof listDepartmentsQuerySchema>
