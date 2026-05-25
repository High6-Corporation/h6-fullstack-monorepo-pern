import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { generateId } from "../ulid"

// NextAuth.js required tables for the Drizzle adapter.
// Even though we use JWT sessions (not database sessions), the adapter
// schema is still required by @auth/drizzle-adapter for user lookup.

export const accounts = pgTable(
  "accounts",
  {
    id: varchar("id", { length: 26 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    userId: varchar("user_id", { length: 26 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (table) => [
    index("accounts_provider_account_id_idx").on(
      table.provider,
      table.providerAccountId
    ),
  ]
)

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$defaultFn(() => generateId()),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: varchar("user_id", { length: 26 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
)
