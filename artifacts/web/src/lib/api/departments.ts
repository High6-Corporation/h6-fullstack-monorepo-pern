import {
  getGetDepartmentsQueryKey,
  useGetDepartments,
} from "@workspace/api-client-react/generated/departments/departments"
import type {
  Department,
  GetDepartmentsParams,
  PaginationLinks,
  PaginationMeta,
} from "@workspace/api-client-react/generated/index.schemas"
import { type RawApiResponse } from "@workspace/api-client-react"
import { getDepartmentsResponse } from "@workspace/api-zod/departments"
import { parseEnvelope } from "./_envelope"

export interface Paginated<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

export type DepartmentsQuery = GetDepartmentsParams

function selectDepartmentsPage(res: RawApiResponse): Paginated<Department> {
  const { data, links, meta } = parseEnvelope(res, getDepartmentsResponse)
  return { data, links, meta }
}

export function useDepartments(query: DepartmentsQuery = {}) {
  return useGetDepartments<Paginated<Department>>(query, {
    query: {
      queryKey: getGetDepartmentsQueryKey(query),
      select: selectDepartmentsPage,
    },
  })
}
