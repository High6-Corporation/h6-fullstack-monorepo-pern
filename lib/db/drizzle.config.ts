import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"
import path from "node:path"

config({ path: path.resolve(process.cwd(), "../../.env"), override: true })

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
})