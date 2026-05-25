# Deploying to Vercel + Neon

This project is set up so you can keep developing on Replit while running production on Vercel + Neon (serverless Postgres).

> Replit = dev environment (you + the agent build features here)
> Vercel = production hosting
> Neon = production database

---

## One-time setup

### 1. Push the code to GitHub

In Replit, open the **Git** pane (left sidebar) and choose **Connect to GitHub → Create new repository**. Replit handles the first push for you. (Terminal `git push` is blocked in this sandbox, so use the Git pane.)

### 2. Create a Vercel project

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import the repo you just pushed.
3. Vercel auto-detects Next.js — leave the build settings on defaults.
4. **Don't deploy yet** — finish the env vars below first.

### 3. Provision Neon Postgres

In the Vercel project dashboard → **Storage → Create Database → Neon**. Pick a region close to your users. Vercel automatically injects `DATABASE_URL` (and a few extras like `POSTGRES_URL`) into every environment.

### 4. Set the remaining env vars in Vercel

Project Settings → Environment Variables. Set each variable to the scope shown:

| Variable               | Scope                  | Value                                                  |
| ---------------------- | ---------------------- | ------------------------------------------------------ |
| `AUTH_SECRET`          | Production + Preview   | Run `openssl rand -base64 32` and paste the output     |
| `AUTH_URL`             | Production only        | Your stable production URL, e.g. `https://your-app.vercel.app` or your custom domain |
| `NEXT_PUBLIC_APP_URL`  | Production only        | Same as `AUTH_URL`                                     |

`DATABASE_URL` is already injected by the Neon integration — don't add it manually.

> **Preview deploys:** leave `AUTH_URL` and `NEXT_PUBLIC_APP_URL` unset. Each preview gets a unique URL per branch/commit, so a fixed value would break callbacks. NextAuth's `trustHost: true` auto-detects the preview host, and the image config falls back to Vercel's auto-injected `VERCEL_URL`.
>
> **Env var name compatibility:** this project uses Auth.js v5, which reads `AUTH_SECRET` and `AUTH_URL`. If you migrated from NextAuth v4 docs or tooling that expects `NEXTAUTH_SECRET` / `NEXTAUTH_URL`, those names also work — Auth.js v5 reads both for backward compatibility. Pick one set and stay consistent.

### 5. Apply the schema to Neon

From your local machine (or Replit shell), point Drizzle at Neon **once** to create tables:

```bash
# Copy the Neon connection string from Vercel → Storage → Neon → .env tab
echo 'DATABASE_URL=postgresql://...neon.tech/...?sslmode=require' > .env.local
npm run db:push
npm run db:seed   # optional: seeds the default admin user (skip if you plan to copy real data in step 5a)
```

Then restore your dev `DATABASE_URL` in `.env.local` so local dev keeps using your Replit/local Postgres.

> **Never** run `db:push` automatically on Vercel. Migrations are a manual / CI step.

### 5a. (Optional) Copy existing data from Replit Postgres to Neon

If you already have real data in the Replit Postgres database and don't want to lose it at cutover, run the migration script. It dumps data-only from the source, then truncates and reloads the target tables inside one transaction — preserving ULIDs, timestamps, password hashes, and foreign keys.

```bash
# Make sure the Neon schema is in place first (step 5 above).
SOURCE_DATABASE_URL='postgresql://...replit-host/...'           \
TARGET_DATABASE_URL='postgresql://...neon.tech/...?sslmode=require' \
  ./scripts/migrate-db.sh
```

What to expect:

- **Rollback on failure**: the TRUNCATE and the COPY blocks are submitted to the target in a single `psql --single-transaction` run. If any statement fails, the whole transaction rolls back and the target is left exactly as it was before you ran the script.
- **Verification**: after restore, the script prints a per-table source-vs-target row count and exits non-zero if any table doesn't match. Re-run before cutover until you see all matches and no warnings.
- **Re-runnable**: you can run the script repeatedly against the same target — each run replaces the target's data with a fresh copy from the source.
- **No superuser needed**: the script doesn't use `--disable-triggers`, so it works against managed Postgres (Neon) without elevated privileges. FK integrity is maintained by dumping/loading parents before children.

> **Maintenance note:** the list of tables to migrate is hardcoded near the top of `scripts/migrate-db.sh` (the `TABLES=(...)` array). When you add a new table to `lib/db/schema/`, add it to this array in FK dependency order (parents before children) so the next migration run includes it.

### 6. Deploy

Back in Vercel, click **Deploy**. First build takes ~2 minutes. Open the `*.vercel.app` URL when it's done.

### 7. Smoke test

- Visit the URL → you should be redirected to `/login`.
- Log in with the seed credentials (`leanne@high6.test` / `password`) or whatever you seeded.
- Walk through Users, Posts, Settings → CRUD should work.

---

## Ongoing workflow

| Action                              | Where                                           |
| ----------------------------------- | ----------------------------------------------- |
| Build features                      | Replit (with the agent)                         |
| Commit + push                       | Replit Git pane                                 |
| Deploy to production                | Automatic on push to `main`                     |
| Preview deploys                     | Automatic for every branch / pull request       |
| Schema changes                      | Generate locally, run `db:push` against Neon    |
| Rollback                            | Vercel dashboard → Deployments → Promote a prior deploy |

---

## Notes

- `proxy.ts` and `lib/auth.ts` already use `trustHost: true` and forwarded-header-friendly checks, which Vercel sets correctly.
- The current DB driver is `pg` (`drizzle-orm/node-postgres`). It works fine on Vercel out of the box. If you later want sub-100ms cold starts, swap to `@neondatabase/serverless` with `drizzle-orm/neon-serverless` — same Drizzle schema, no query changes.
- Replit Deployments still works in parallel — you can keep both running while you migrate.
