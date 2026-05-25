import {
  pgTable,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { generateId } from "../ulid"

// Use varchar + Zod validation at the application layer (Server Actions).
export const POST_STATUSES = ["published", "draft"] as const
export type PostStatus = (typeof POST_STATUSES)[number]

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 26 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    title: varchar("title", { length: 500 }).notNull(),
    body: text("body").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    userId: varchar("user_id", { length: 26 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("posts_user_id_idx").on(table.userId)]
)

export type SelectPost = typeof posts.$inferSelect
export type InsertPost = typeof posts.$inferInsert
