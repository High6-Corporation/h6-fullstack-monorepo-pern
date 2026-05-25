# High6 Suite — Agent Instructions

Read this file in full before making any changes.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Monorepo | pnpm 10 workspaces |
| Frontend | React 19, Vite 7, react-router-dom v6, TanStack React Query v5 |
| UI | shadcn/ui (Radix), Tailwind CSS v4, lucide-react |
| Backend | Express 5, TypeScript, tsx watch |
| Database | PostgreSQL + Drizzle ORM (node-postgres) |
| Auth | scrypt password hash + JWT cookie (`h6_session`); Clerk deferred |
| Forms | React Hook Form + Zod v4 |
| API contract | OpenAPI 3.1 (`lib/api-spec/openapi.yaml`) + Orval codegen |
| Runtime | Node 20 |

## Workspace layout

```
artifacts/
  web/                    React + Vite SPA (port 5000)
  api-server/             Express API (port 3001)
lib/
  db/                     @workspace/db — drizzle schema, queries, migrations
  api-spec/               @workspace/api-spec — openapi.yaml + orval config
  api-client-react/       @workspace/api-client-react — generated hooks + fetcher
  api-zod/                @workspace/api-zod — generated Zod schemas
docs/
  standards/              Detailed per-layer standards
  decisions/              ADRs
```

## Commands

```bash
pnpm dev                                       # api + web together
pnpm --filter @workspace/api-spec run codegen  # regenerate client/zod from openapi
pnpm --filter @workspace/db run push           # dev-only schema push
pnpm --filter @workspace/db run seed           # seed dev data
pnpm run typecheck                             # workspace typecheck
```

Use `pnpm` exclusively. Never introduce `npm` or `yarn`.

## Rules

1. **OpenAPI is the contract.** Add or change an endpoint by editing
   `lib/api-spec/openapi.yaml` first, then run codegen, then implement the
   Express route and React Query consumer. Never hand-write fetch calls in
   pages — always use the generated hook or an `actions/` shim that wraps
   one.
2. **Response envelope.** Every API response is
   `{ success: true, data }` or `{ success: false, error?|errors? }`.
   Backend helpers in `artifacts/api-server/src/lib/responses.ts`. Frontend
   `apiFetch` (`lib/api-client-react/src/fetcher.ts`) unwraps `data` and
   throws `ApiError` on failure.
3. **Validate at the boundary.** Express controllers parse input with the
   Zod schemas in `artifacts/api-server/src/validators/`; failures return
   HTTP 422 with field-keyed `errors`.
4. **No Next.js.** Do not reintroduce `next/*`, server actions,
   `"use client"`, `"use server"`, or `app/` directories. The frontend is
   a pure SPA.
5. **Same-origin in the browser.** The web app calls `/api` and `/uploads`;
   the Vite dev server proxies them to `:3001`. Do not call absolute URLs
   or `localhost` from the browser.
6. **Secrets.** Read `DATABASE_URL`, `AUTH_SECRET`, `SESSION_SECRET` from
   the environment. Never log them. `.env.example` documents the full set.
7. **Database access.** Only `@workspace/api-server` imports
   `@workspace/db`. The web app must never import database code.
8. **Workflows.** The configured workflow `Start application` runs
   `pnpm dev`. Restart it via the workflow tooling, not by editing
   `.replit`.

## Per-layer standards

- `docs/standards/backend-standard.md`
- `docs/standards/frontend-standard.md`
- `docs/standards/database-standard.md`
