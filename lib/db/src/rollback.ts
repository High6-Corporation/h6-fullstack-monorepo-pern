/**
 * Database Rollback Script
 *
 * Rolls back the last applied migration by:
 * 1. Finding the most recent migration entry in drizzle.__drizzle_migrations
 * 2. Reading the corresponding SQL migration file
 * 3. Running the inverse SQL (from a .down.sql file if it exists, or prompting manual rollback)
 * 4. Removing the migration entry from the journal
 *
 * Usage:
 *   npm run db:rollback          # Roll back the last migration
 *   npm run db:rollback -- --dry-run  # Show what would be rolled back without executing
 */

import { config } from "dotenv"
import { readFileSync } from "fs"
import { join } from "path"
import { Client } from "pg"

config({ path: ".env.local" })

const DRY_RUN = process.argv.includes("--dry-run")
const MIGRATIONS_DIR = join(import.meta.dirname, "migrations")

async function rollback() {
  const conn = new Client({ connectionString: process.env.DATABASE_URL! })
  await conn.connect()

  try {
    // 1. Get the last applied migration from the journal
    const { rows } = await conn.query(
      "SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id DESC LIMIT 1"
    )
    const lastMigration = rows[0]

    if (!lastMigration) {
      console.log("No migrations to roll back.")
      return
    }

    // 2. Read the journal to find the migration tag
    const journalPath = join(MIGRATIONS_DIR, "meta", "_journal.json")
    const journal = JSON.parse(readFileSync(journalPath, "utf-8"))

    const entries = journal.entries
    if (entries.length === 0) {
      console.log("No migration entries in journal.")
      return
    }

    // Match by created_at timestamp
    const lastEntry = entries.find(
      (e: { when: number }) => e.when === Number(lastMigration.created_at)
    )

    if (!lastEntry) {
      console.log(
        `Could not find journal entry for migration (created_at: ${lastMigration.created_at})`
      )
      console.log(
        "You may need to manually remove the entry from drizzle.__drizzle_migrations"
      )
      return
    }

    const tag = lastEntry.tag
    const migrationFile = `${tag}.sql`
    const downFile = `${tag}.down.sql`

    console.log(`Rolling back migration: ${tag}`)

    // 3. Read the up-migration SQL for reference
    const upSql = readFileSync(join(MIGRATIONS_DIR, migrationFile), "utf-8")
    console.log(`\nUp migration SQL:\n${upSql.trim()}\n`)

    // 4. Check for a .down.sql file (manually created rollback SQL)
    let downSql = null
    try {
      downSql = readFileSync(join(MIGRATIONS_DIR, downFile), "utf-8")
      console.log(`Down migration SQL:\n${downSql.trim()}\n`)
    } catch {
      console.log(`No rollback file found: ${downFile}`)
      console.log(
        `To create one, write the inverse SQL in: lib/db/migrations/${downFile}`
      )
      console.log("\nFor reference, the up migration was:")
      console.log(upSql.trim())
      console.log("\nCommon inverse operations:")
      console.log('  ADD COLUMN "x"    →  ALTER TABLE "t" DROP COLUMN "x"')
      console.log('  DROP COLUMN "x"   →  ALTER TABLE "t" ADD COLUMN "x" type')
      console.log('  CREATE TABLE "t"  →  DROP TABLE "t"')
      console.log("  CREATE INDEX      →  DROP INDEX")
      console.log("")
      console.log("Create the .down.sql file and run this script again.")
      return
    }

    if (DRY_RUN) {
      console.log("\n[DRY RUN] Would execute the following SQL:")
      console.log(downSql.trim())
      console.log("\n[DRY RUN] Would remove migration entry from journal.")
      return
    }

    // 5. Execute the down migration
    console.log("Executing rollback SQL...")
    await conn.query(downSql)

    // 6. Remove the migration entry from the journal
    await conn.query(
      "DELETE FROM drizzle.__drizzle_migrations WHERE id = $1",
      [lastMigration.id]
    )

    console.log(`\n✓ Successfully rolled back migration: ${tag}`)
    console.log(
      "Note: The schema file was NOT changed. Revert your schema changes manually."
    )
  } catch (error) {
    console.error("Rollback failed:", error)
    process.exit(1)
  } finally {
    await conn.end()
  }
}

rollback()
