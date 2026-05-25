# Backend Standard

This service is an Express 5 + TypeScript HTTP API running under `tsx watch`
in development. It lives in `artifacts/api-server/` and is reverse-proxied by
the Vite dev server at `/api` and `/uploads`.

## Folder layout

```
artifacts/api-server/src/
  routes/          Express route registration only (no logic)
  controllers/     Parse request, call service, format envelope
  services/        Business logic and orchestration
  validators/      Zod schemas for request bodies and queries
  middlewares/     Auth, logging, error handling
  lib/             Shared helpers (responses, session, password)
  index.ts         Server bootstrap (listen + signals)
  app.ts           Express app composition
```

## Response envelope

Every JSON response uses one of these shapes:

```ts
{ success: true,  data: T }
{ success: false, error: string }
{ success: false, errors: Record<string, string[]> } // validation
```

Use `ok(res, data, status?)` and `fail(res, status, error|errors)` from
`src/lib/responses.ts`. Never return bare objects.

## Validation

Validate all request input with the Zod schemas in `src/validators/`. On
failure return HTTP 422 with `{ success: false, errors }` where `errors` is
keyed by field name.

## Authentication

`loadSession` reads the `h6_session` JWT cookie and populates `req.session`.
`requireAuth` rejects unauthenticated requests with HTTP 401. The login
controller issues the cookie via `setSessionCookie`; the logout controller
clears it via `clearSessionCookie`. Cookies are `HttpOnly`, `SameSite=Lax`,
and `Secure` in production.

## Errors

Throw early in services. The global `errorHandler` middleware converts thrown
errors to the failure envelope and logs server-side errors. `notFoundHandler`
returns 404 for unmatched routes.

## API contract

`lib/api-spec/openapi.yaml` is the source of truth for the HTTP contract.
When a route changes shape, update the spec and run:

```bash
pnpm --filter @workspace/api-spec run codegen
```

This regenerates the React Query hooks in `lib/api-client-react/generated/`
and the Zod schemas in `lib/api-zod/generated/`.
