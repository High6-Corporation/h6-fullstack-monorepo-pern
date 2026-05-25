import { eq } from "drizzle-orm"
import { db } from "../connection"
import { securitySettings, users as usersTable } from "../schema"
import type { SelectSecuritySettings } from "../schema"
import type { SecuritySettings } from "../types/account-types"
import { hashPassword } from "./users"
import { scryptSync, timingSafeEqual } from "node:crypto"

function verifyPassword(plain: string, stored: string): boolean {
  // Format: scrypt$N$saltHex$keyHex
  const parts = stored.split("$")
  if (parts.length !== 4 || parts[0] !== "scrypt") return false
  const N = Number(parts[1])
  const salt = Buffer.from(parts[2]!, "hex")
  const expected = Buffer.from(parts[3]!, "hex")
  const derived = scryptSync(plain, salt, expected.length, { N })
  return derived.length === expected.length && timingSafeEqual(derived, expected)
}
// --- Security Settings ---

function toSecuritySettings(row: SelectSecuritySettings): SecuritySettings {
  return {
    passwordUpdatedAt: row.passwordUpdatedAt?.toISOString() ?? null,
  }
}

export async function getSecuritySettings(): Promise<SecuritySettings> {
  const [row] = await db.select().from(securitySettings).limit(1)
  if (!row) {
    const [created] = await db
      .insert(securitySettings)
      .values({})
      .returning()
    return toSecuritySettings(created!)
  }
  return toSecuritySettings(row)
}

export async function changePassword(
  userId: string,
  data: { currentPassword: string; newPassword: string }
): Promise<SecuritySettings> {
  // Verify the current password before allowing the change
  const [user] = await db
    .select({ passwordHash: usersTable.passwordHash })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1)

  if (!user || !verifyPassword(data.currentPassword, user.passwordHash)) {
    throw new Error("Current password is incorrect")
  }

  const passwordHash = hashPassword(data.newPassword)

  await db
    .update(usersTable)
    .set({ passwordHash })
    .where(eq(usersTable.id, userId))

  // Ensure security settings row exists
  await getSecuritySettings()
  const [existing] = await db
    .select({ id: securitySettings.id })
    .from(securitySettings)
    .limit(1)
  const [row] = await db
    .update(securitySettings)
    .set({ passwordUpdatedAt: new Date() })
    .where(eq(securitySettings.id, existing!.id))
    .returning()

  return toSecuritySettings(row!)
}
