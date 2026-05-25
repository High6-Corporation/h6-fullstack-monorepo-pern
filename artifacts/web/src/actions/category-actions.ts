import { runAction } from "@workspace/api-client-react"
import {
    postCategories,
    patchCategoriesId,
    deleteCategoriesId,
    getCategories
} from "@workspace/api-client-react/generated/categories/categories"
import type { CategoriesPageEnvelope } from "@workspace/api-client-react/generated/index.schemas"
import type { ActionResult } from "@/types/action-result"

export interface CategoryActionData {
    name: string
    description: string
    isActive: boolean
}

export async function createCategoryAction(data: CategoryActionData): Promise<ActionResult> {
    return runAction(() => postCategories(data), "Failed to create category")
}

export async function updateCategoryAction(id: string, data: CategoryActionData): Promise<ActionResult> {
    return runAction(() => patchCategoriesId(id, data), "Failed to update category")
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
    return runAction(() => deleteCategoriesId(id), "Failed to delete category")
}

export async function fetchCategoriesAction(): Promise<ActionResult> {
    return runAction(() => getCategories(), "Failed to fetch categories")
}

export interface FetchOptionsParams {
  q?: string
  page: number
  perPage: number
  selectedValue?: string
}

export interface FetchOptionsResult {
  data: Array<{ value: string; label: string }>
  hasMore: boolean
}

export async function searchCategoriesAction(
  params: FetchOptionsParams
): Promise<FetchOptionsResult> {
  try {
    const perPage = params.perPage ?? 20
    const page = params.page ?? 1
    const res = await getCategories({ q: params.q, page, perPage })
    if (res.status >= 200 && res.status < 300) {
      const env = res.data as CategoriesPageEnvelope | undefined
      if (env && env.success !== false) {
        return {
          data: env.data.map((c) => ({ value: c.id, label: c.name })),
          hasMore: env.meta.current_page < env.meta.last_page,
        }
      }
    }
    return { data: [], hasMore: false }
  } catch {
    return { data: [], hasMore: false }
  }
}
