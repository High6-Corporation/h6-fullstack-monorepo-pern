import { z } from "zod/v4"
import { ApiError, type RawApiResponse } from "@workspace/api-client-react"

export function throwApiError(res: RawApiResponse): never {
  const fail = res.data as
    | { error?: string; errors?: Record<string, string[]> }
    | undefined
  throw new ApiError(
    fail?.error ?? `Request failed (${res.status})`,
    res.status,
    fail?.errors
  )
}

/**
 * Parse a successful API response through a Zod schema. Any 4xx/5xx is
 * surfaced as `ApiError` via `throwApiError`, and a schema mismatch on a
 * 2xx response is surfaced as an `ApiError` so React Query exposes it
 * via `query.error` instead of silently lying about the type.
 *
 * The returned value is typed via `z.infer<S>`, so callers do not need
 * any casts as long as the generated schema matches the expected shape.
 */
export function parseEnvelope<S extends z.ZodType>(
  res: RawApiResponse,
  schema: S
): z.infer<S> {
  if (res.status < 200 || res.status >= 300) throwApiError(res)
  const parsed = schema.safeParse(res.data)
  if (!parsed.success) {
    throw new ApiError(
      `Invalid API response (${res.status}): ${parsed.error.message}`,
      res.status
    )
  }
  return parsed.data
}
