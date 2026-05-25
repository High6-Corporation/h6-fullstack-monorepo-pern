# High6 Replit Standard Gap Fix Report

Updated against `H6 Replit Standard v3.md`.

## Fixed

### 1. Normalized DB folder structure

Moved database files from root-level folders into the standard structure:

```txt
lib/db/src/schema/
lib/db/src/queries/
lib/db/src/types/
lib/db/src/migrations/
lib/db/src/connection.ts
lib/db/src/index.ts
```

Updated `lib/db/package.json` exports so app code still imports through package paths:

```ts
@workspace/db/queries/users
@workspace/db/queries/departments
@workspace/db/schema
```

### 2. Added migration structure

Added:

```txt
lib/db/drizzle.config.ts
lib/db/src/migrations/README.md
```

`db:push` remains available for development only. Use `generate` + `migrate` for staging/production.

### 3. Added gold-standard sample module

Added `Departments` as the reference CRUD module:

```txt
artifacts/api-server/src/controllers/DepartmentsController.ts
artifacts/api-server/src/services/DepartmentsService.ts
artifacts/api-server/src/validators/departments.ts
lib/db/src/schema/departments.ts
lib/db/src/queries/departments.ts
artifacts/web/src/pages/departments/DepartmentsIndexPage.tsx
artifacts/web/src/components/features/departments/DepartmentsView.tsx
artifacts/web/src/lib/api/departments.ts
```

This demonstrates:

```txt
Route → Controller → Validator → Service → Query → Schema
OpenAPI → Generated Client → React Page
```

### 4. Updated OpenAPI

Added departments endpoints to:

```txt
lib/api-spec/openapi.yaml
```

Added generated-style client/Zod files:

```txt
lib/api-client-react/generated/departments/departments.ts
lib/api-zod/generated/departments/departments.ts
```

After running dependency install, regenerate with:

```bash
pnpm --filter @workspace/api-spec run codegen
```

### 5. Auth left as SSO placeholder

No forced Clerk/custom auth implementation was added.

Updated:

```txt
artifacts/api-server/src/middlewares/auth.ts
.env.example
```

Rules now documented in code:

- `AUTH_BYPASS=true` is local/dev only.
- Production blocks auth bypass.
- Future SSO should resolve `userId`, `tenantId`, and roles server-side.
- Frontend-provided tenant/role data must not be trusted.

### 6. Updated documentation

Updated/added:

```txt
README.md
docs/standards/database-standard.md
docs/standards/sample-module-standard.md
```

## Still intentionally not finalized

- Real SSO/Clerk integration is still pending by design.
- Tenant scoping is documented but not fully implemented globally yet.
- Generated client files were manually added in generated-style form because dependencies were not installed in this cleanup environment. Run codegen after `pnpm install`.

## Recommended post-extract commands

```bash
pnpm install
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run generate
pnpm run typecheck
pnpm run build
```
