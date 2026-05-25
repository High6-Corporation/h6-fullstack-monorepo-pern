/**
 * Client-safe account types.
 *
 * This module MUST NOT import from server-only modules so that Client
 * Components can freely import these symbols.
 */

// ─── Security Settings ──────────────────────────────────────────────────────

export interface SecuritySettings {
  /** ISO timestamp of the last password change, or null if never changed. */
  passwordUpdatedAt?: string | null
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}
