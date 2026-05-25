import {
  useGetCategories,
  useGetCategoriesId,
  getGetCategoriesQueryKey,
  getGetCategoriesIdQueryKey,
} from "@workspace/api-client-react/generated/categories/categories"
import type {
  GetCategoriesParams,
  Category,
} from "@workspace/api-client-react/generated/index.schemas"
import { type RawApiResponse } from "@workspace/api-client-react"
import {
  getCategoriesResponse,
  getCategoriesIdResponse,
} from "@workspace/api-zod/categories"
import { parseEnvelope } from "./_envelope"
import type { Paginated } from "./users"

export type { Category }
export type CategoriesQuery = GetCategoriesParams

function selectCategoriesPage(res: RawApiResponse): Paginated<Category> {
  const { data, links, meta } = parseEnvelope(res, getCategoriesResponse)
  return { data, links, meta }
}

function selectCategory(res: RawApiResponse): Category {
  return parseEnvelope(res, getCategoriesIdResponse).data
}

export function useCategories(query: CategoriesQuery = {}) {
  return useGetCategories<Paginated<Category>>(query, {
    query: {
      queryKey: getGetCategoriesQueryKey(query),
      select: selectCategoriesPage,
    },
  })
}

export function useCategory(id: string | undefined) {
  return useGetCategoriesId<Category>(id ?? "", {
    query: {
      queryKey: getGetCategoriesIdQueryKey(id),
      select: selectCategory,
      enabled: !!id,
    },
  })
}
