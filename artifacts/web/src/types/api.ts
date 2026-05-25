/**
 * Shared entity types used across both server and client code.
 *
 * These interfaces mirror the database schema shapes and are safe to import
 * from Client Components (no server-only dependencies).
 */

export interface Post {
  id: string
  title: string
  body: string
  status: "published" | "draft"
  userId: string
}

export interface User {
  id: string
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  contactNumber?: string | null
  avatar?: string | null
}
