import type { Request, Response, NextFunction } from "express"
import { fail } from "../lib/responses.js"

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId?: string
        tenantId?: string
        roles?: string[]
      }
    }
  }
}

/**
 * Authentication boundary.
 *
 * Current starter behavior:
 * - Local/dev can use AUTH_BYPASS=true to keep Replit training fast.
 * - Production must connect this middleware to High6 SSO / Clerk / another
 *   approved identity provider before real client deployment.
 *
 * SSO TODO:
 * 1. Verify the SSO session/JWT here.
 * 2. Resolve userId, tenantId, roles, and permissions server-side.
 * 3. Never trust tenant_id or role values supplied by the frontend.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (process.env.AUTH_BYPASS === "true") {
    if (process.env.NODE_ENV === "production") {
      return fail(res, "Auth bypass is disabled in production", 500)
    }

    req.auth = {
      userId: process.env.DEV_AUTH_USER_ID ?? "dev-user",
      tenantId: process.env.DEV_AUTH_TENANT_ID ?? "dev-tenant",
      roles: ["admin"],
    }
    return next()
  }

  if (!req.auth?.userId) return fail(res, "Not authenticated", 401)
  next()
}
