import type { Response } from "express"
import type { ZodError } from "zod"

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data })
}

export function okPage<T>(
  res: Response,
  page: { data: T[]; links: unknown; meta: unknown },
  status = 200
) {
  return res.status(status).json({ success: true, ...page })
}

export function fail(res: Response, error: string, status = 400) {
  return res.status(status).json({ success: false, error })
}

export function failValidation(res: Response, error: ZodError, status = 422) {
  const flat = error.flatten()
  return res.status(status).json({
    success: false,
    errors: flat.fieldErrors as Record<string, string[]>,
  })
}
