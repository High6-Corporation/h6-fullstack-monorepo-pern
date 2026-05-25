import { and, count, eq, ilike, or } from "drizzle-orm"
import { db } from "../connection"
import { categories } from "../schema"
import { SelectCategory } from "../schema"
import type { Paginated } from "./users"

export interface Category{
    id: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface CategoryListQuery {
  page?: number
  perPage?: number
  q?: string
  isActive?: boolean
}

export interface CategoryInput {
  name: string
  description?: string | null
  isActive?: boolean
}

function toCategory(row: SelectCategory): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}   

export async function getCategories(
    query: CategoryListQuery = {}
): Promise<Paginated<Category>> {
    const page = Math.max(1, query.page ?? 1)
    const perPage = Math.max(1, Math.min(100, query.perPage ?? 20))
    const offset = (page - 1) * perPage
    const conditions = []

    if (query.q) {
        conditions.push(
          or(
            ilike(categories.name, `%${query.q}%`),
            ilike(categories.description, `%${query.q}%`)
          )
        )
    }

    // Default to showing only active categories unless explicitly filtered
    const isActiveFilter = query.isActive ?? true
    conditions.push(eq(categories.isActive, isActiveFilter))

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(where)
        .limit(perPage)
        .offset(offset)
        .orderBy(categories.name),
      db.select({ total: count() }).from(categories).where(where),
    ])

    const lastPage = Math.max(1, Math.ceil(total / perPage))
  const from = rows.length === 0 ? null : offset + 1
  const to = rows.length === 0 ? null : offset + rows.length

  return {
    data: rows.map(toCategory),
    links: {
      first: total === 0 ? null : `/categories?page=1&perPage=${perPage}`,
      last: total === 0 ? null : `/categories?page=${lastPage}&perPage=${perPage}`,
      prev: page > 1 ? `/categories?page=${page - 1}&perPage=${perPage}` : null,
      next: page < lastPage ? `/categories?page=${page + 1}&perPage=${perPage}` : null,
    },
    meta: {
      current_page: page,
      from,
      last_page: lastPage,
      path: "/categories",
      per_page: perPage,
      to,
      total,
    },
  }
}

export async function getCategory(id: string): Promise<Category | null> {
    const [row] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1)
    return row ? toCategory(row) : null
}

export async function createCategory(data: CategoryInput): Promise<Category> {
    const [row] = await db
    .insert(categories)
    .values({
        name: data.name,
        description: data.description ?? null,
        isActive: data.isActive ?? true,
    })
    .returning()
    return toCategory(row)
}

export async function updateCategory(
    id: string,
    data: CategoryInput
): Promise<Category | null> {
    const [row] = await db
    .update(categories)
    .set({
        name: data.name,
        description: data.description ?? null,
        isActive: data.isActive ?? true,
    })
    .where(eq(categories.id, id))
    .returning()
    return row ? toCategory(row) : null
}

export async function archiveCategory(id: string): Promise<Category | null> {
    const [row] = await db
    .update(categories)
    .set({ isActive: false })
    .where(eq(categories.id, id))
    .returning()
    return row ? toCategory(row) : null
}
