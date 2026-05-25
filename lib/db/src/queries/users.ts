import { eq, ilike, or, and, count } from "drizzle-orm"
import { db } from "../connection"
import { users } from "../schema"
import { scryptSync, randomBytes } from "node:crypto"
import type { SelectUser } from "../schema"
import { generateId } from "../ulid"

// --- Types (matching existing app interfaces) ---

export interface User {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  contactNumber?: string
  avatar?: string
}

export interface UserListQuery {
  page?: number
  perPage?: number
  q?: string
}

export interface Paginated<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

// --- Helpers ---

function toUser(row: SelectUser): User {
  return {
    id: row.id,
    firstName: row.firstName,
    middleName: row.middleName ?? undefined,
    lastName: row.lastName,
    email: row.email,
    contactNumber: row.contactNumber ?? undefined,
    avatar: row.avatar ?? undefined,
  }
}

// --- Password hashing ---

const SCRYPT_N = 16384
const SCRYPT_KEY_LEN = 64

export function hashPassword(plain: string): string {
  const salt = randomBytes(16)
  const key = scryptSync(plain, salt, SCRYPT_KEY_LEN, { N: SCRYPT_N })
  return `scrypt$${SCRYPT_N}$${salt.toString("hex")}$${key.toString("hex")}`
}

// --- Queries ---

export async function getUsers(
  query: UserListQuery = {}
): Promise<Paginated<User>> {
  const page = Math.max(1, query.page ?? 1)
  const perPage = Math.max(1, Math.min(100, query.perPage ?? 10))
  const offset = (page - 1) * perPage

  // PostgreSQL ILIKE for case-insensitive search.
  const conditions = query.q
    ? or(
        ilike(users.firstName, `%${query.q}%`),
        ilike(users.middleName, `%${query.q}%`),
        ilike(users.lastName, `%${query.q}%`),
        ilike(users.email, `%${query.q}%`)
      )
    : undefined

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(users)
      .where(conditions)
      .limit(perPage)
      .offset(offset)
      .orderBy(users.id),
    db.select({ total: count() }).from(users).where(conditions),
  ])

  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const from = rows.length === 0 ? null : offset + 1
  const to = rows.length === 0 ? null : offset + rows.length

  return {
    data: rows.map(toUser),
    links: {
      first: total === 0 ? null : `/users?_page=1&_per_page=${perPage}`,
      last:
        total === 0 ? null : `/users?_page=${lastPage}&_per_page=${perPage}`,
      prev: page > 1 ? `/users?_page=${page - 1}&_per_page=${perPage}` : null,
      next:
        page < lastPage
          ? `/users?_page=${page + 1}&_per_page=${perPage}`
          : null,
    },
    meta: {
      current_page: page,
      from,
      last_page: lastPage,
      path: "/users",
      per_page: perPage,
      to,
      total,
    },
  }
}

export async function getUser(id: string): Promise<User | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return row ? toUser(row) : null
}

export async function getUserByEmail(
  email: string
): Promise<SelectUser | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)
  return row ?? null
}

export type CreateUserPayload = Omit<User, "id"> & { password: string }

export async function createUser(data: CreateUserPayload): Promise<User> {
  const id = generateId()
  const { password, ...fields } = data
  await db.insert(users).values({
    id,
    ...fields,
    passwordHash: hashPassword(password),
  })
  return { id, ...fields }
}

export type UpdateUserPayload = Partial<Omit<User, "id">>

export async function updateUser(
  id: string,
  data: UpdateUserPayload
): Promise<User> {
  const [row] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()
  return toUser(row!)
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id))
}
