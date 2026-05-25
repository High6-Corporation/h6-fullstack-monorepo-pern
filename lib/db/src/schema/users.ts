import {
  pgTable,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { generateId } from "../ulid"

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 26 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    contactNumber: varchar("contact_number", { length: 50 }),
    avatar: varchar("avatar", { length: 500 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)]
)

export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
