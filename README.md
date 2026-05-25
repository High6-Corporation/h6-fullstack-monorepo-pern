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
# update DATABASE_URL and other environment values
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run seed
pnpm dev
```

Default dev ports:

- Web: `http://localhost:5000`
- API: `http://localhost:3001`

The Vite web app calls `/api` and `/uploads`; the dev server proxies them to the Express API.

## Important commands

```bash
pnpm dev                                       # run API + web
pnpm run typecheck                             # typecheck all workspaces
pnpm run build                                 # build API + web
pnpm --filter @workspace/api-spec run codegen  # regenerate API client/Zod from OpenAPI
pnpm --filter @workspace/db run push           # dev schema push only
pnpm --filter @workspace/db run seed           # seed dev data
```

## Architecture rules

1. OpenAPI is the contract. Change `lib/api-spec/openapi.yaml` first, then run codegen.
2. The web app must not import database code directly.
3. API responses must use the standard envelope: `{ success: true, data }` or `{ success: false, error|errors }`.
4. Secrets must stay in `.env` or the hosting provider's secret manager. Do not commit `.env`, `.replit` userenv secrets, or uploaded runtime files.
5. Generated build outputs like `dist/` and runtime uploads are intentionally excluded from this cleaned package.

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

This starter now includes a reference `departments` module that shows the preferred High6 Replit pattern:

```txt
Controller → Service → Query Module → Drizzle Schema
OpenAPI → Generated Client → React Page
```

Key paths:

```txt
artifacts/api-server/src/controllers/DepartmentsController.ts
artifacts/api-server/src/services/DepartmentsService.ts
artifacts/api-server/src/validators/departments.ts
lib/db/src/schema/departments.ts
lib/db/src/queries/departments.ts
artifacts/web/src/pages/departments/DepartmentsIndexPage.tsx
```

Auth is intentionally left as a placeholder for future High6 SSO. `AUTH_BYPASS=true` is for local training only and is blocked in production.

Database files follow the normalized standard:

```txt
lib/db/src/schema/
lib/db/src/queries/
lib/db/src/migrations/
lib/db/src/index.ts
```
