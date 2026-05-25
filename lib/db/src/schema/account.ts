import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core"
import { generateId } from "../ulid"

// --- Security Settings (single-row) ---

export const securitySettings = pgTable("security_settings", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$defaultFn(() => generateId()),
  passwordUpdatedAt: timestamp("password_updated_at"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type SelectSecuritySettings = typeof securitySettings.$inferSelect
