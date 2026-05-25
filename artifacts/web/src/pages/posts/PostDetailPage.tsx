import { useParams } from "react-router-dom"
import PostDetailView from "@/components/features/posts/PostDetailView"
import { Spinner } from "@/components/ui/spinner"
import { usePost } from "@/lib/api/posts"
import { useUsers } from "@/lib/api/users"
import { getUserDisplayName } from "@/lib/utils"

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading } = usePost(id)
  const { data: usersPage } = useUsers({ perPage: 100 })

  if (isLoading || !post || !usersPage) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }

  const author = usersPage.data.find((u) => u.id === post.userId)
  const authorName = author
    ? getUserDisplayName(author) || author.email
    : `User ${post.userId}`
  const userOptions = usersPage.data.map((user) => ({
    id: user.id,
    name: getUserDisplayName(user) || user.email,
  }))

  return (
    <PostDetailView post={post} authorName={authorName} users={userOptions} />
  )
}
