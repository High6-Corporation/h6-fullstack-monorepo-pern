import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import { generateId } from "../ulid"

/**
 * Reference module table used as the High6 gold-standard CRUD example.
 *
 * Multi-tenant note:
 * Add `tenant_id` here when this starter is connected to Record Hub / SSO.
 * Do not accept tenant IDs directly from the frontend; resolve them server-side.
 */
export const departments = pgTable(
  "departments",
  {
    id: varchar("id", { length: 26 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("departments_name_idx").on(table.name)]
)

export type SelectDepartment = typeof departments.$inferSelect
export type InsertDepartment = typeof departments.$inferInsert
