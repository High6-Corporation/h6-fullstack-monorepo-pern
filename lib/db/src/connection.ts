import { drizzle as drizzleNode } from "drizzle-orm/node-postgres"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless"
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless"
import { Pool as NodePool } from "pg"
import ws from "ws"
import * as schema from "./schema/index"

/**
 * Singleton PostgreSQL connection + Drizzle instance.
 *
 * On Vercel (serverless), uses `@neondatabase/serverless` for low-latency
 * cold starts. Locally, uses the standard `pg` driver against local/Replit
 * Postgres.
 *
 * In development, Next.js hot-reloads modules which can create many
 * connections. We cache on `globalThis` to prevent connection pool exhaustion.
 */

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to your .env.local file.")
}

const isVercel = !!process.env.VERCEL

const globalForDb = globalThis as unknown as {
  conn: NodePool | NeonPool | undefined
  db: ReturnType<typeof drizzleNode<typeof schema>> | ReturnType<typeof drizzleNeon<typeof schema>> | undefined
}

function createDb() {
  if (isVercel) {
    neonConfig.webSocketConstructor = ws
    const pool = new NeonPool({ connectionString: DATABASE_URL })
    return { conn: pool, db: drizzleNeon(pool, { schema }) }
  }
  const pool = new NodePool({ connectionString: DATABASE_URL })
  return { conn: pool, db: drizzleNode(pool, { schema }) }
}

const cached = globalForDb.db
  ? { conn: globalForDb.conn!, db: globalForDb.db }
  : createDb()

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = cached.conn
  globalForDb.db = cached.db
}

export const db = cached.db
