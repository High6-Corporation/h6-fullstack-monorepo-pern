import { and, count, eq, ilike, or } from "drizzle-orm"
import { db } from "../connection"
import { departments } from "../schema"
import type { SelectDepartment } from "../schema"
import type { Paginated } from "./users"

export interface Department {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DepartmentListQuery {
  page?: number
  perPage?: number
  q?: string
  isActive?: boolean
}

export interface DepartmentInput {
  name: string
  description?: string | null
  isActive?: boolean
}

function toDepartment(row: SelectDepartment): Department {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getDepartments(
  query: DepartmentListQuery = {}
): Promise<Paginated<Department>> {
  const page = Math.max(1, query.page ?? 1)
  const perPage = Math.max(1, Math.min(100, query.perPage ?? 20))
  const offset = (page - 1) * perPage
  const conditions = []

  if (query.q) {
    conditions.push(
      or(
        ilike(departments.name, `%${query.q}%`),
        ilike(departments.description, `%${query.q}%`)
      )
    )
  }

  if (typeof query.isActive === "boolean") {
    conditions.push(eq(departments.isActive, query.isActive))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(departments)
      .where(where)
      .limit(perPage)
      .offset(offset)
      .orderBy(departments.name),
    db.select({ total: count() }).from(departments).where(where),
  ])

  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const from = rows.length === 0 ? null : offset + 1
  const to = rows.length === 0 ? null : offset + rows.length

  return {
    data: rows.map(toDepartment),
    links: {
      first: total === 0 ? null : `/departments?page=1&perPage=${perPage}`,
      last: total === 0 ? null : `/departments?page=${lastPage}&perPage=${perPage}`,
      prev: page > 1 ? `/departments?page=${page - 1}&perPage=${perPage}` : null,
      next: page < lastPage ? `/departments?page=${page + 1}&perPage=${perPage}` : null,
    },
    meta: {
      current_page: page,
      from,
      last_page: lastPage,
      path: "/departments",
      per_page: perPage,
      to,
      total,
    },
  }
}

export async function getDepartment(id: string): Promise<Department | null> {
  const [row] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1)
  return row ? toDepartment(row) : null
}

export async function createDepartment(
  data: DepartmentInput
): Promise<Department> {
  const [row] = await db
    .insert(departments)
    .values({
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    })
    .returning()

  return toDepartment(row!)
}

export async function updateDepartment(
  id: string,
  data: DepartmentInput
): Promise<Department | null> {
  const [row] = await db
    .update(departments)
    .set({
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    })
    .where(eq(departments.id, id))
    .returning()

  return row ? toDepartment(row) : null
}

export async function archiveDepartment(id: string): Promise<Department | null> {
  const [row] = await db
    .update(departments)
    .set({ isActive: false })
    .where(eq(departments.id, id))
    .returning()

  return row ? toDepartment(row) : null
}
