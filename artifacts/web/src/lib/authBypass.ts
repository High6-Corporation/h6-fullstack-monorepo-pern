const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined
const explicit = import.meta.env.VITE_AUTH_BYPASS as string | undefined

export const AUTH_BYPASS: boolean =
  explicit === "true" || (explicit !== "false" && !clerkKey)
