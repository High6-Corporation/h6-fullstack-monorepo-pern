# Sample Module Standard: Departments

The `departments` module is the reference pattern for new CRUD modules.

## Backend flow

```txt
Route
→ Controller
→ Zod validator
→ Service
→ DB query module
→ Drizzle schema
```

Files:

```txt
artifacts/api-server/src/routes/index.ts
artifacts/api-server/src/controllers/DepartmentsController.ts
artifacts/api-server/src/services/DepartmentsService.ts
artifacts/api-server/src/validators/departments.ts
lib/db/src/schema/departments.ts
lib/db/src/queries/departments.ts
```

## Frontend flow

```txt
React page
→ feature component
→ app API helper
→ generated Orval client
→ API endpoint
```

Files:

```txt
artifacts/web/src/pages/departments/DepartmentsIndexPage.tsx
artifacts/web/src/components/features/departments/DepartmentsView.tsx
artifacts/web/src/lib/api/departments.ts
lib/api-client-react/generated/departments/departments.ts
lib/api-zod/generated/departments/departments.ts
lib/api-spec/openapi.yaml
```

## Rule

When building a new module, copy the responsibilities, not the exact business fields.
Keep controllers thin, use services for business rules, keep Drizzle inside query modules, and update OpenAPI before using the generated client.
