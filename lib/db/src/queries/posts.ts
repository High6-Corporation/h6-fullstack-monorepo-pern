import { eq, ilike, or, and, inArray, count } from "drizzle-orm"
import { db } from "../connection"
import { posts, users } from "../schema"
import type { SelectPost } from "../schema"
import type { Paginated } from "./users"
import { generateId } from "../ulid"

// --- Types ---

export interface Post {
  id: string
  title: string
  body: string
  status: "published" | "draft"
  userId: string
}

export interface PostListQuery {
  page?: number
  perPage?: number
  q?: string
  userId?: string | string[]
  status?: string | string[]
}

// --- Helpers ---

function toPost(row: SelectPost): Post {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    status: row.status as "published" | "draft",
    userId: row.userId,
  }
}

// --- Queries ---

export async function getPosts(
  query: PostListQuery = {}
): Promise<Paginated<Post>> {
  const page = Math.max(1, query.page ?? 1)
  const perPage = Math.max(1, Math.min(100, query.perPage ?? 10))
  const offset = (page - 1) * perPage

  const conditions = []

  // Search filter — PostgreSQL ILIKE for case-insensitive search
  if (query.q) {
    conditions.push(
      or(ilike(posts.title, `%${query.q}%`), ilike(posts.body, `%${query.q}%`))
    )
  }

  // User ID filter
  if (query.userId) {
    const ids = Array.isArray(query.userId) ? query.userId : [query.userId]
    conditions.push(inArray(posts.userId, ids))
  }

  // Status filter
  if (query.status) {
    const statuses = Array.isArray(query.status) ? query.status : [query.status]
    conditions.push(
      inArray(posts.status, statuses as ("published" | "draft")[])
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .limit(perPage)
      .offset(offset)
      .orderBy(posts.id),
    db.select({ total: count() }).from(posts).where(where),
  ])

  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const from = rows.length === 0 ? null : offset + 1
  const to = rows.length === 0 ? null : offset + rows.length

  return {
    data: rows.map(toPost),
    links: {
      first: total === 0 ? null : `/posts?_page=1&_per_page=${perPage}`,
      last:
        total === 0 ? null : `/posts?_page=${lastPage}&_per_page=${perPage}`,
      prev: page > 1 ? `/posts?_page=${page - 1}&_per_page=${perPage}` : null,
      next:
        page < lastPage
          ? `/posts?_page=${page + 1}&_per_page=${perPage}`
          : null,
    },
    meta: {
      current_page: page,
      from,
      last_page: lastPage,
      path: "/posts",
      per_page: perPage,
      to,
      total,
    },
  }
}

export async function getPost(id: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
  return row ? toPost(row) : null
}

export async function createPost(data: Omit<Post, "id">): Promise<Post> {
  const id = generateId()
  await db.insert(posts).values({ id, ...data })
  return { id, ...data }
}

export async function updatePost(
  id: string,
  data: Partial<Post>
): Promise<Post> {
  const [row] = await db
    .update(posts)
    .set(data)
    .where(eq(posts.id, id))
    .returning()
  return toPost(row!)
}

export async function deletePost(id: string): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id))
}
