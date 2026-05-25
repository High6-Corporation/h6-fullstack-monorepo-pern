import { z } from "zod"

const emptyToUndef = (v: unknown) =>
  v && typeof v === "string" && v.trim().length > 0 ? v : undefined

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional().transform(emptyToUndef),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  contactNumber: z.string().optional().transform(emptyToUndef),
  avatar: z.string().optional().transform(emptyToUndef),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
