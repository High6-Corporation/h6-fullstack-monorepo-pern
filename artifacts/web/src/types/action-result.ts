/**
 * Shared result type returned by all server actions.
 *
 * By centralizing this, every action caller can rely on the same shape
 * without re-declaring the interface in each action file.
 */
export interface ActionResult {
  success: boolean
  /** A single human-readable error message (non-field-specific). */
  error?: string
  /** Field-level validation errors keyed by field name. */
  errors?: Record<string, string[]>
}
