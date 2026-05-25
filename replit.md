# High6 Suite (Replit)

Before making changes, read:

- `AGENTS.md`
- `docs/standards/backend-standard.md`
- `docs/standards/frontend-standard.md`
- `docs/standards/database-standard.md`

## Architecture

pnpm monorepo with a split frontend/backend per High6 Replit Standard v3.

| Path | Package | Role |
| --- | --- | --- |
| `artifacts/web/` | `@workspace/web` | React 19 + Vite 7 SPA (port 5000) |
| `artifacts/api-server/` | `@workspace/api-server` | Express 5 API (port 3001) |
| `lib/db/` | `@workspace/db` | Drizzle ORM schema, queries, migrations |
| `lib/api-spec/` | `@workspace/api-spec` | OpenAPI source of truth + Orval codegen |
| `lib/api-client-react/` | `@workspace/api-client-react` | Generated React Query hooks |
| `lib/api-zod/` | `@workspace/api-zod` | Generated Zod schemas |

The Vite dev server proxies `/api` and `/uploads` to the API on port 3001
so the browser always talks to the same origin.

## Commands

```bash
pnpm dev                                       # run api + web together
pnpm --filter @workspace/api-server dev        # api only
pnpm --filter @workspace/web dev               # web only
pnpm --filter @workspace/api-spec run codegen  # regenerate hooks + zod from openapi.yaml
pnpm --filter @workspace/db run push           # dev-only schema push
pnpm --filter @workspace/db run seed           # seed dev data
pnpm run typecheck                             # workspace-wide typecheck
```

The configured Replit workflow `Start application` runs `pnpm dev` and
waits for port 5000.

## Auth (current state)

**Auth bypass is active by default** — the app boots straight to the dashboard
as a fake "Dev User" (`dev@high6.local`) without requiring any Clerk credentials.

This is controlled by `VITE_AUTH_BYPASS` in `artifacts/web/src/lib/authBypass.ts`:
- Bypass is `true` automatically when `VITE_CLERK_PUBLISHABLE_KEY` is not set.
- To enable real Clerk sign-in, add `VITE_CLERK_PUBLISHABLE_KEY` (and
  `CLERK_SECRET_KEY`) as Replit Secrets. The bypass turns off automatically.
- You can also force bypass off with `VITE_AUTH_BYPASS=false` once keys are set.

Clerk wiring is preserved: `ClerkProvider`, `SignIn`, `SignOutButton`, and
`useUser` are all still in the codebase — they just activate only when bypass
is off. The API does not enforce auth while bypass is on (frontend-only change).

## User preferences

- pnpm monorepo layout per H6 Replit Standard v3.
- Standard envelope: `{ success, data }` / `{ success: false, error|errors }`.
- Do not reintroduce Next.js, server actions, or `next/*` imports.
