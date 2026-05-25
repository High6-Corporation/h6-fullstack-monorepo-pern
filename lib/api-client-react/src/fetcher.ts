/**
 * Shared fetch wrapper used by the Orval-generated React Query hooks.
 *
 * All responses use the standard API envelope:
 *   { success: true, data }
 *   { success: false, error }
 *   { success: false, errors: { field: [msg] } }
 *
 * `apiFetch(url, RequestInit)` is the Orval `fetch` httpClient mutator —
 * it returns `{ status, data, headers }` where `data` is the parsed JSON
 * envelope.
 */
export interface ApiSuccess<T> {
  success: true
  data: T
}
export interface ApiFailure {
  success: false
  error?: string
  errors?: Record<string, string[]>
}
export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}


function getBaseUrl(): string {
  const fromEnv =
    (typeof import.meta !== "undefined" &&
      (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env
        ?.VITE_API_BASE_URL) ||
    ""
  return fromEnv || "/api"
}

function resolveUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input
  const base = getBaseUrl().replace(/\/$/, "")
  // Orval generates absolute paths like `/api/users`; strip the duplicated
  // `/api` prefix so we don't end up with `/api/api/users`.
  let path = input.startsWith("/") ? input : `/${input}`
  if (base.endsWith("/api") && path.startsWith("/api/")) {
    path = path.slice(4)
  }
  return `${base}${path}`
}

export async function apiFetch<T>(
  rawUrl: string,
  init?: RequestInit
): Promise<T> {
  const url = resolveUrl(rawUrl)
  const res = await fetch(url, {
    ...init,
    credentials: init?.credentials ?? "include",
  })
  let data: unknown
  try {
    data = await res.json()
  } catch {
    data = undefined
  }
  return {
    status: res.status,
    data,
    headers: res.headers,
  } as T
}

/**
 * Raw response shape produced by the Orval `apiFetch` mutator.
 * Used by helpers below that interpret the standard envelope.
 */
export interface RawApiResponse {
  status: number
  data: unknown
  headers: Headers
}

/**
 * Unwrap the `{ success: true, data }` envelope returned by a generated
 * request function. Throws `ApiError` on any non-success response so
 * `select`/`queryFn` callers surface errors via React Query's `error`.
 */
export function unwrapResponse<T>(res: RawApiResponse): T {
  const env = res.data as ApiEnvelope<T> | undefined
  if (res.status >= 200 && res.status < 300 && env && env.success !== false) {
    return (env as ApiSuccess<T>).data
  }
  const fail = env as ApiFailure | undefined
  throw new ApiError(
    fail?.error ?? `Request failed (${res.status})`,
    res.status,
    fail?.errors
  )
}

/** Server-action style result shared by every `actions/*` function. */
export type ActionEnvelope<T = void> =
  | { success: true; data?: T }
  | { success: false; error?: string; errors?: Record<string, string[]> }

/**
 * Invoke a generated request function and map its response into the
 * `ActionEnvelope` shape used by handwritten action wrappers.
 */
export async function runAction<T = void>(
  call: () => Promise<RawApiResponse>,
  fallbackMessage: string
): Promise<ActionEnvelope<T>> {
  try {
    const res = await call()
    const env = res.data as ApiEnvelope<T> | undefined
    if (res.status >= 200 && res.status < 300 && env && env.success !== false) {
      return { success: true, data: (env as ApiSuccess<T>).data }
    }
    const fail = env as ApiFailure | undefined
    return {
      success: false,
      error: fail?.error ?? fallbackMessage,
      errors: fail?.errors,
    }
  } catch {
    return { success: false, error: fallbackMessage }
  }
}
