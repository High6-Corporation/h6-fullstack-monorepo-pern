import {
  useGetPosts,
  useGetPostsId,
  getGetPostsQueryKey,
  getGetPostsIdQueryKey,
} from "@workspace/api-client-react/generated/posts/posts"
import type {
  GetPostsParams,
  Post,
} from "@workspace/api-client-react/generated/index.schemas"
import { type RawApiResponse } from "@workspace/api-client-react"
import {
  getPostsResponse,
  getPostsIdResponse,
} from "@workspace/api-zod/posts"
import { parseEnvelope } from "./_envelope"
import type { Paginated } from "./users"

export type { Post }
export type PostsQuery = GetPostsParams

function selectPostsPage(res: RawApiResponse): Paginated<Post> {
  const { data, links, meta } = parseEnvelope(res, getPostsResponse)
  return { data, links, meta }
}

function selectPost(res: RawApiResponse): Post {
  return parseEnvelope(res, getPostsIdResponse).data
}

export function usePosts(query: PostsQuery = {}) {
  return useGetPosts<Paginated<Post>>(query, {
    query: {
      queryKey: getGetPostsQueryKey(query),
      select: selectPostsPage,
    },
  })
}

export function usePost(id: string | undefined) {
  return useGetPostsId<Post>(id ?? "", {
    query: {
      queryKey: getGetPostsIdQueryKey(id),
      select: selectPost,
      enabled: !!id,
    },
  })
}
