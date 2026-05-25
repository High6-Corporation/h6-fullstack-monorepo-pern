# Frontend Standard

The web app is a React 19 + Vite 7 SPA in `artifacts/web/`. It is served on
port 5000 in development and proxies `/api` and `/uploads` to the Express
API on port 3001.

## Folder layout

```
artifacts/web/src/
  pages/           Route-level components (one folder per feature)
  layouts/         AuthLayout, GuestLayout
  routes/          ProtectedRoute, GuestRoute guards
  components/
    ui/            shadcn primitives
    shared/        Cross-feature shared components
    features/      Feature-scoped components
  context/         React context providers (Theme, ColorTheme)
  actions/         Thin shims over `@workspace/api-client-react` used by
                   pages that want a server-action–style call site
  lib/             Generic browser helpers
  types/           Shared TypeScript types
  styles/          Global CSS (Tailwind v4)
  main.tsx         App bootstrap (providers + router)
  App.tsx          Route table
```

## Routing

Routing uses `react-router-dom` v6. Navigation uses `useNavigate()` and
`<Link>`. Protected routes go through `<ProtectedRoute>`, guest-only routes
through `<GuestRoute>`.

## Data fetching

Use the generated React Query hooks from
`@workspace/api-client-react/generated/<tag>/<tag>`. The shared
`apiFetch` mutator wraps `fetch`, sends cookies (`credentials: "include"`),
and throws `ApiError` on failure so React Query routes to `onError`.

Do not import `fetch` directly from pages. Add a new hook to the OpenAPI
spec and regenerate instead.

## Styling

Tailwind v4 via `@tailwindcss/vite`. Global tokens live in
`src/styles/globals.css`. Color themes are CSS variables that the
`ColorThemeProvider` swaps at runtime based on `/settings/appearance`.

## Environment

The web app only reads `import.meta.env.VITE_*`. The API base URL defaults
to `/api` (same-origin via Vite proxy in dev, served from the API in
production).
