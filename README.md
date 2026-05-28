# H6 Express + React Starter

Monorepo starter for High6 internal apps using:

- React 19 + Vite SPA in `artifacts/web`
- Express 5 + TypeScript API in `artifacts/api-server`
- PostgreSQL + Drizzle ORM in `lib/db`
- OpenAPI 3.1 contract in `lib/api-spec/openapi.yaml`
- Generated React Query client in `lib/api-client-react`
- Generated Zod schemas in `lib/api-zod`

## Requirements

- Node.js 20+
- pnpm 10+
- PostgreSQL database

## Setup

```bash
pnpm install
cp .env.example .env
# Update DATABASE_URL and other environment values in the root .env file.
 # VITE_API_PROXY_TARGET must be set — the Vite dev server will fail to proxy
# /api and /uploads requests if this value is missing. It should match the
# PORT value set for the API server (default: http://localhost:3001).
# drizzle-kit reads the .env from lib/db/drizzle.config.ts which points to the root .env.
# Always use a fresh/empty PostgreSQL database on first setup to avoid schema conflicts.
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run seed
pnpm dev
```

Default dev ports:

- Web: `http://localhost:5000`
- API: `http://localhost:3001`

The Vite web app calls `/api` and `/uploads`; the dev server proxies them to the Express API
using the `VITE_API_PROXY_TARGET` value from the root `.env` file.

## Schema changes

Use the correct workflow depending on where you are in the project lifecycle:

**Initial setup / early prototyping (empty database):**
```bash
pnpm --filter @workspace/db run push
```
This directly syncs your schema to the database. Safe only on a fresh DB with no existing tables. Running push against an existing database after schema changes can cause errors — particularly when altering primary key columns.

**Adding or modifying modules on an existing database:**
```bash
pnpm --filter @workspace/db run generate  # creates a SQL migration file in lib/db/src/migrations/
pnpm --filter @workspace/db run migrate   # applies it to the database — no interactive prompts
```
This is the correct long-term workflow. Migration files are committed to the repo, giving the team a full audit trail of schema changes.

> **Rule of thumb:** Use `push` once on a fresh DB to get started. After that, always use `generate` + `migrate`.

## Important commands

```bash
pnpm dev                                       # run API + web
pnpm run typecheck                             # typecheck all workspaces
pnpm run build                                 # build API + web
pnpm --filter @workspace/api-spec run codegen  # regenerate API client/Zod from OpenAPI
pnpm --filter @workspace/db run push           # initial schema push — fresh DB only
pnpm --filter @workspace/db run generate       # generate a migration from schema changes
pnpm --filter @workspace/db run migrate        # apply pending migrations
pnpm --filter @workspace/db run seed           # seed dev data
```

## Architecture rules

1. OpenAPI is the contract. Change `lib/api-spec/openapi.yaml` first, then run codegen.
2. The web app must not import database code directly.
3. API responses must use the standard envelope: `{ success: true, data }` or `{ success: false, error|errors }`.
4. Secrets must stay in `.env` or the hosting provider's secret manager. Do not commit `.env`, `.replit` userenv secrets, or uploaded runtime files.
5. Generated build outputs like `dist/` and runtime uploads are intentionally excluded from this cleaned package.
6. Always use `generate` + `migrate` (not `push`) when modifying schema on an existing database.
7. `VITE_API_PROXY_TARGET` is required in the root `.env`. The Vite dev server reads it at startup to proxy `/api` and `/uploads` — there is no hardcoded fallback. If it is missing, all API calls will fail with a proxy error.

## Main folders

```text
artifacts/
  web/                    React + Vite SPA
  api-server/             Express API
lib/
  db/                     Drizzle schema, queries, seed, migrations
  api-spec/               OpenAPI spec + Orval config
  api-client-react/       Generated React Query client + fetcher
  api-zod/                Generated Zod schemas
docs/
  standards/              Backend, frontend, and database standards
  decisions/              Architecture decisions
```

## High6 Standard Alignment Notes

This starter includes a reference `posts` module that shows the preferred High6 pattern:

```txt
Controller → Service → Query Module → Drizzle Schema
OpenAPI → Generated Client → React Page
```

Key paths:

```txt
artifacts/api-server/src/controllers/PostsController.ts
artifacts/api-server/src/services/PostsService.ts
artifacts/api-server/src/validators/posts.ts
lib/db/src/schema/posts.ts
lib/db/src/queries/posts.ts
artifacts/web/src/pages/posts/PostsIndexPage.tsx
```

Auth is intentionally left as a placeholder for future High6 SSO. `AUTH_BYPASS=true` is for local training only and is blocked in production.

Database files follow the normalized standard:

```txt
lib/db/src/schema/
lib/db/src/queries/
lib/db/src/migrations/
lib/db/src/index.ts
```