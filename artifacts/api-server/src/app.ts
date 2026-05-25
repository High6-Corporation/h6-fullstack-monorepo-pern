import { mkdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import { requestLogger } from "./middlewares/requestLogger.js"
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js"
import { apiRouter } from "./routes/index.js"
import { UploadService } from "./services/UploadService.js"

export const app = express()

app.disable("x-powered-by")
app.use(helmet({ contentSecurityPolicy: false }))
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl (no Origin header) and configured origins
      if (!origin) return cb(null, true)
      if (allowedOrigins.length === 0) {
        // Dev fallback: allow any origin only when explicitly not production
        if (process.env.NODE_ENV !== "production") return cb(null, true)
        return cb(new Error("CORS: no allowed origins configured"))
      }
      if (allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`CORS: origin not allowed: ${origin}`))
    },
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(requestLogger)

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } })
})

app.use("/api", apiRouter)

mkdirSync(UploadService.UPLOAD_ROOT, { recursive: true })
app.use(
  "/uploads",
  express.static(UploadService.UPLOAD_ROOT, { maxAge: "1h" })
)

// Serve the built React SPA in production.
// In dev, Vite handles the frontend on port 5000; the dist dir won't exist so
// this block is a no-op.  In production the esbuild bundle sits at
// dist/index.js, two directories above artifacts/web/dist/.
const webDist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../web/dist"
)
if (existsSync(webDist)) {
  app.use(express.static(webDist))
  app.get(/.*/, (req, res, next) => {
    if (
      req.path === "/api" ||
      req.path.startsWith("/api/") ||
      req.path === "/uploads" ||
      req.path.startsWith("/uploads/")
    ) {
      return next()
    }
    res.sendFile(path.join(webDist, "index.html"))
  })
}

app.use(notFoundHandler)
app.use(errorHandler)
