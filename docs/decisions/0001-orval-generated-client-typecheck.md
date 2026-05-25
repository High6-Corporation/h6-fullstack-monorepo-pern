# 0001 — Orval-generated React Query client is the single API source of truth

## Status

Accepted — 2026-05-19 (revised)

## Context

`lib/api-client-react/generated/` is produced by Orval 7.21 from
`lib/api-spec/openapi.yaml` via `pnpm --filter @workspace/api-spec run
codegen`. The generated output uses the `fetch` httpClient (mutator =
`lib/api-client-react/src/fetcher.ts → apiFetch`) and the React Query
target. A parallel Zod target writes runtime schemas to
`lib/api-zod/generated/`.

Historically the web app talked to the API through handwritten wrappers
in `artifacts/web/src/lib/api/*.ts` and `artifacts/web/src/actions/*.ts`,
both built on the shim form of `apiFetch`. That meant the OpenAPI spec
described the contract on paper but nothing in the SPA actually consumed
the generated client, so spec drift went undetected.

## Decision

- `lib/api-spec/openapi.yaml` is the single source of truth for the HTTP
  contract. Both `@workspace/api-client-react` and `@workspace/api-zod`
  are regenerated from it via `pnpm --filter @workspace/api-spec run
  codegen` and the generated files are committed.
- The handwritten wrappers in `artifacts/web/src/lib/api/{users,posts,
  settings}.ts` are now thin adapters around the generated hooks
  (`useGetUsers`, `useGetPosts`, `useGetSettings*`, etc.). They use the
  React Query `select` option together with `getXxxQueryKey()` helpers
  to unwrap the standard `{ success, data }` envelope into the shape the
  pages expect (`Paginated<T>`, `User`, `Post`, settings interfaces).
- `artifacts/web/src/actions/*.ts` call the generated request functions
  (`postAuthLogin`, `patchAccountProfile`, `postPosts`, …) and map their
  response through the shared `runAction` helper exported from
  `@workspace/api-client-react`.
- `AuthProvider` and `ThemeProvider` call the generated functions /
  hooks directly. No application code references the shim form of
  `apiFetch` anymore.
- `lib/api-client-react/package.json` exposes the generated files via
  `"./generated/*": "./generated/*.ts"` so consumers can import them
  with `@workspace/api-client-react/generated/<group>/<group>`.
- `apiFetch` is the Orval `(url, RequestInit)` httpClient mutator only.
  `SecondParameter<typeof apiFetch>` resolves to `RequestInit | undefined`,
  which is required for the generated `queryFn` (which spreads
  `{ signal, ...requestOptions }` into the second argument) to typecheck.
- `lib/api-client-react/tsconfig.json` continues to limit `include` to
  `src/**/*` so the package's own typecheck does not have to compile the
  generated tree. Consumers (`artifacts/web`) typecheck the generated
  files transitively via their own `tsc --noEmit`, which now succeeds.

## Consequences

- `pnpm run typecheck` is green across the workspace, including the web
  app's imports of `@workspace/api-client-react/generated/*`.
- Any change to `openapi.yaml` requires re-running
  `pnpm --filter @workspace/api-spec run codegen`; the generated files
  are checked into version control so CI does not have to regenerate.
- New endpoints should be added to the spec first; the page and action
  layers then pick up the new types automatically.
- The Zod schemas in `lib/api-zod/generated/` are kept in sync by the
  same codegen pass and are available for runtime validation when
  needed.
- The handwritten `apiFetch({ url, ... })` shim has been removed; the
  only remaining call signature is the Orval `(url, RequestInit)` form.
