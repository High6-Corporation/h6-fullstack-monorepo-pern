# Database Standard

The database layer lives in `lib/db/` and is published as the
`@workspace/db` workspace package. The API server imports schema and query
helpers from package exports such as `@workspace/db/queries/users`.

Do not import deep internal file paths from other workspaces.

## Stack

- PostgreSQL
- Drizzle ORM
- ULID identifiers generated in application code
- Zod validation before database writes at the API boundary

## Folder layout

```txt
lib/db/
  drizzle.config.ts
  src/
    schema/         One file per table or aggregate
    queries/        Read/write helpers, grouped by feature
    migrations/     Traceable SQL migrations produced by drizzle-kit
    types/          Shared DB/domain types
    connection.ts   Drizzle client singleton using DATABASE_URL
    seed.ts         Idempotent seed for development
    rollback.ts     Optional rollback helper
    index.ts        Public package re-exports
```

This matches the High6 Replit standard: `lib/db/src/index.ts` is the DB entry
point. Do not create a separate root-level `connection.ts`, `schema/`, or
`queries/` folder.

## Commands

```bash
pnpm --filter @workspace/db run generate   # produce a new migration
pnpm --filter @workspace/db run migrate    # apply migrations
pnpm --filter @workspace/db run push       # dev only — push schema directly
pnpm --filter @workspace/db run seed       # seed development data
pnpm --filter @workspace/db run studio     # open Drizzle Studio
```

`db push` is development-only. Staging and production must use generated
migration files.

## Conventions

- One table per schema file under `src/schema/`.
- One query module per domain under `src/queries/`.
- Query modules return plain domain objects, not raw Drizzle rows.
- Controllers should not import Drizzle directly.
- Important business records should be archived/soft-disabled unless the brief explicitly requires hard delete.
- Avoid database enum types; prefer strings/booleans validated by TypeScript and Zod.
- For future multi-tenant apps, add `tenant_id` to tenant-owned tables and scope queries server-side.
