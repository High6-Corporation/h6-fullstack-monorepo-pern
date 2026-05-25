import { ulid } from "ulid"

/**
 * Generate a new ULID string for use as a database primary key.
 *
 * ULIDs are 26-character, lexicographically sortable identifiers.
 * Called via Drizzle's `$defaultFn()` at insert time when no explicit
 * ID is provided, or directly in seed scripts.
 */
export function generateId(): string {
  return ulid()
}
