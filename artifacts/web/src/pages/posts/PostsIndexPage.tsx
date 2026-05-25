import { useSearchParams } from "react-router-dom"
import PostsView from "@/components/features/posts/PostsView"
import { DataTableSkeleton } from "@/components/shared/data-table/DataTableSkeleton"
import { usePosts } from "@/lib/api/posts"
import { useUsers } from "@/lib/api/users"
import { getUserDisplayName } from "@/lib/utils"

export default function PostsIndexPage() {
  const [params] = useSearchParams()
  const page = Math.max(1, Number(params.get("page")) || 1)
  const perPage = Math.max(1, Math.min(100, Number(params.get("perPage")) || 10))
  const search = params.get("search") ?? undefined
  const userId = params.get("userId") ?? undefined
  const status = (params.get("status") as "published" | "draft" | null) ?? undefined

  const { data: postsPage, isLoading } = usePosts({
    page,
    perPage,
    q: search,
    userId,
    status,
  })
  const { data: usersPage } = useUsers({ perPage: 100 })

  if (isLoading || !postsPage || !usersPage) return <DataTableSkeleton />

  const userOptions = usersPage.data.map((user) => ({
    id: user.id,
    name: getUserDisplayName(user) || user.email,
  }))

  return (
    <PostsView
      posts={postsPage.data}
      users={userOptions}
      totalPosts={postsPage.meta.total}
      totalPages={postsPage.meta.last_page}
      currentPage={postsPage.meta.current_page}
      pageSize={postsPage.meta.per_page}
    />
  )
}
