# Database Migrations

This folder is reserved for traceable Drizzle migration files.

Development shortcut:

```bash
pnpm --filter @workspace/db run push
```

Staging/production pattern:

```bash
pnpm --filter @workspace/db run generate
pnpm --filter @workspace/db run migrate
```

Do not rely on `db:push` for production schema changes.
