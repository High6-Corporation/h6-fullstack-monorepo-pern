import {
  useGetUsers,
  useGetUsersId,
  getGetUsersQueryKey,
  getGetUsersIdQueryKey,
} from "@workspace/api-client-react/generated/users/users"
import type { GetUsersParams } from "@workspace/api-client-react/generated/index.schemas"
import type {
  SessionUser,
  PaginationLinks,
  PaginationMeta,
} from "@workspace/api-client-react/generated/index.schemas"
import { type RawApiResponse } from "@workspace/api-client-react"
import {
  getUsersResponse,
  getUsersIdResponse,
} from "@workspace/api-zod/users"
import { parseEnvelope } from "./_envelope"

export type User = SessionUser

export interface Paginated<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

export type UsersQuery = GetUsersParams

function selectUsersPage(res: RawApiResponse): Paginated<User> {
  const { data, links, meta } = parseEnvelope(res, getUsersResponse)
  return { data, links, meta }
}

function selectUser(res: RawApiResponse): User {
  return parseEnvelope(res, getUsersIdResponse).data
}

export function useUsers(query: UsersQuery = {}) {
  return useGetUsers<Paginated<User>>(query, {
    query: {
      queryKey: getGetUsersQueryKey(query),
      select: selectUsersPage,
    },
  })
}

export function useUser(id: string | undefined) {
  return useGetUsersId<User>(id ?? "", {
    query: {
      queryKey: getGetUsersIdQueryKey(id),
      select: selectUser,
      enabled: !!id,
    },
  })
}
