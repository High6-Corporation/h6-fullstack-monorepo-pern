import { z } from "zod/v4"

const emptyToUndef = (v: unknown) =>
  v && typeof v === "string" && v.trim().length > 0 ? v : undefined

const baseUserFields = {
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional().transform(emptyToUndef),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  contactNumber: z.string().optional().transform(emptyToUndef),
  avatar: z.string().optional().transform(emptyToUndef),
}

export const createUserSchema = z.object({
  ...baseUserFields,
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const updateUserSchema = z.object(baseUserFields)

export const listUsersQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  dir: z.enum(["asc", "desc"]).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>
