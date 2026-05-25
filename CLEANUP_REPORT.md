# Cleanup Report

## Removed from the original ZIP

- `.local/` — Replit/local pnpm store and runtime state; largest source of bloat.
- `.git/` — repository history; not needed in a handoff ZIP and can expose old files.
- `.config/` — local machine/editor environment cache.
- `.agents/`, `.claude/`, `.qoder/`, `.qwen/`, `skills/` — duplicated local agent skill packs, not required to run the app.
- `attached_assets/` — previous uploaded reference files/images and nested ZIPs, not app source.
- `artifacts/*/dist/` — generated build output; should be rebuilt locally or in CI.
- `*.tsbuildinfo` — TypeScript incremental build cache.
- Runtime upload files under `public/uploads` / `artifacts/*/public/uploads`; placeholder `.gitkeep` files were kept where needed.
- Embedded Replit `userenv.shared` values were removed from `.replit`.

## Kept

- Source code for the Express API and React/Vite SPA.
- Shared libraries: database, OpenAPI spec, generated API client, and generated Zod schemas.
- `pnpm-lock.yaml`, workspace config, docs, standards, and deployment notes.
- Public static app assets such as `high6-logo.png` and `favicon.ico`.

## Notes

This cleaned package is intended for development handoff or Qoder/Replit continuation. Run `pnpm install` after extracting because dependency caches were intentionally removed.
