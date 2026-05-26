import { runAction } from "@workspace/api-client-react"
import {
  postPosts,
  patchPostsId,
  deletePostsId,
  getPosts,
} from "@workspace/api-client-react/generated/posts/posts"
import type { PostsPageEnvelope } from "@workspace/api-client-react/generated/index.schemas"
import type { ActionResult } from "@/types/action-result"

export interface PostActionData {
  title: string
  body: string
  status: "published" | "draft"
  userId: string
}

export async function createPostAction(
  data: PostActionData
): Promise<ActionResult> {
  return runAction(() => postPosts(data), "Failed to create post")
  
}

export async function updatePostAction(
  id: string,
  data: PostActionData
): Promise<ActionResult> {
  return runAction(() => patchPostsId(id, data), "Failed to update post")
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  return runAction(() => deletePostsId(id), "Failed to delete post")
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

export async function searchPostsAction(
  params: FetchOptionsParams
): Promise<FetchOptionsResult> {
  try {
    const perPage = params.perPage ?? 20
    const page = params.page ?? 1
    const res = await getPosts({ q: params.q, page, perPage })
    if (res.status >= 200 && res.status < 300) {
      const env = res.data as PostsPageEnvelope | undefined
      if (env && env.success !== false) {
        return {
          data: env.data.map((p) => ({ value: p.id, label: p.title })),
          hasMore: env.meta.current_page < env.meta.last_page,
        }
      }
    }
    return { data: [], hasMore: false }
  } catch {
    return { data: [], hasMore: false }
  }
}
