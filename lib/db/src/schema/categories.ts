import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import { generateId } from "../ulid"
import { uniqueIndex } from "drizzle-orm/pg-core";


export const categories = pgTable(
  "categories",
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
  (table) => [
    index("categories_name_idx").on(table.name),
    uniqueIndex("categories_name_unique").on(table.name),
  ]
)

export type SelectCategory = typeof categories.$inferSelect
export type InsertCategory = typeof categories.$inferInsert