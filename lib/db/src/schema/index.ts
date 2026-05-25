import { relations } from "drizzle-orm"
import { users } from "./users"
import { posts, POST_STATUSES } from "./posts"
import type { PostStatus } from "./posts"
import {
  generalSettings,
  appearanceSettings,
  notificationsSettings,
  helpCenterSettings,
} from "./settings"
import { securitySettings } from "./account"
import { accounts, sessions } from "./auth"
import { departments } from "./departments"
import { categories } from "./categories"

// Re-export all schema tables
export {
  users,
  posts,
  POST_STATUSES,
  generalSettings,
  appearanceSettings,
  notificationsSettings,
  helpCenterSettings,
  securitySettings,
  accounts,
  sessions,
  departments,
  categories,
}

// Re-export types
export type { SelectUser, InsertUser } from "./users"
export type { SelectPost, InsertPost, PostStatus } from "./posts"
export type {
  SelectGeneralSettings,
  SelectAppearanceSettings,
  SelectNotificationsSettings,
  SelectHelpCenterSettings,
} from "./settings"
export type { SelectSecuritySettings } from "./account"
export type { SelectDepartment, InsertDepartment } from "./departments"
export type { SelectCategory, InsertCategory } from "./categories"
export { verificationTokens } from "./auth"

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
