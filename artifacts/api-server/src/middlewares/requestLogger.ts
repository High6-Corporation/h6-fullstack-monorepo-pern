import type { Request, Response, NextFunction } from "express"

const REDACTED_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
])

export function redactHeaders(headers: Request["headers"]) {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(headers)) {
    out[k] = REDACTED_HEADERS.has(k.toLowerCase()) ? "[redacted]" : v
  }
  return out
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  res.on("finish", () => {
    const ms = Date.now() - start
    // eslint-disable-next-line no-console
    console.log(
      `[api] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`
    )
  })
  next()
}
