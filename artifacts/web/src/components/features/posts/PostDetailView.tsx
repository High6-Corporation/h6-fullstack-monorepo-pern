import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
} from "@/components/shared/view-page/Page"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PostSheetForm, {
  type Post,
  type UserOption,
} from "@/components/features/posts/PostSheetForm"
import { type Post as ApiPost } from "@/types/api"

import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog/DeleteConfirmDialog"
import { deletePostAction } from "@/actions/post-actions"
import { Pencil, Trash2, User, Calendar } from "lucide-react"
import { toast } from "sonner"

interface PostDetailViewProps {
  post: ApiPost
  authorName: string
  users: UserOption[]
}

export default function PostDetailView({
  post,
  authorName,
  users,
}: PostDetailViewProps) {
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isPublished = post.status === "published"

  const sheetPost: Post = {
    id: post.id,
    title: post.title,
    body: post.body,
    status: post.status,
    userId: post.userId,
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deletePostAction(post.id)
    setIsDeleting(false)
    setDeleteOpen(false)
    if (result.success) {
      toast.success("Post deleted")
      navigate("/posts")
    } else {
      toast.error(result.error ?? "Failed to delete post")
    }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>{post.title}</PageTitle>
          <PageDescription>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {authorName}
            </span>
          </PageDescription>
        </div>
        <PageActions>
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Post #{post.id}
          </span>
        </div>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-wrap">{post.body}</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Author Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{authorName}</p>
                <p className="text-sm text-muted-foreground">
                  User ID: {post.userId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContent>
      <PostSheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        post={sheetPost}
        users={users}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Post"
        description="This will permanently remove the post. This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Page>
  )
}
