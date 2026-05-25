import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { fail, failValidation } from "../lib/responses.js"

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  return fail(res, "Not found", 404)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return failValidation(res, err)
  }
  if (err instanceof HttpError) {
    return fail(res, err.message, err.status)
  }
  // eslint-disable-next-line no-console
  console.error("[api] unhandled error", err)
  return fail(res, "Internal server error", 500)
}
