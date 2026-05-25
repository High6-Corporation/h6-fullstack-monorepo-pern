import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import { ColumnDef } from "@tanstack/react-table"
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
} from "@/components/shared/view-page/Page"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DataTable,
  type FilterOption,
} from "@/components/shared/data-table/DataTable"
import { DataTableToolbar } from "@/components/shared/data-table/DataTableToolbar"
import { DataTablePagination } from "@/components/shared/data-table/DataTablePagination"
import { RowActions } from "@/components/shared/row-actions/RowActions"
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog/DeleteConfirmDialog"
import PostSheetForm, {
  type Post,
  type UserOption,
} from "@/components/features/posts/PostSheetForm"
import { type Post as ApiPost } from "@/types/api"
import { deletePostAction } from "@/actions/post-actions"
import { Plus } from "lucide-react"
import { toast } from "sonner"

const statusOptions: FilterOption[] = [
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
]

function getColumns(
  users: UserOption[],
  onView: (id: string) => void,
  onEdit: (post: ApiPost) => void,
  onDelete: (id: string) => void
): ColumnDef<ApiPost>[] {
  const userMap = new Map(users.map((u) => [u.id, u.name]))

  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link to={`/posts/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    {
      accessorKey: "userId",
      header: "Author",
      cell: ({ row }) =>
        userMap.get(row.original.userId) ?? `User ${row.original.userId}`,
      meta: {
        displayName: "Author",
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={status === "published" ? "default" : "secondary"}>
            {status === "published" ? "Published" : "Draft"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      meta: {
        enableHiding: false,
      },
      cell: ({ row }) => (
        <RowActions
          onView={() => onView(row.original.id)}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original.id)}
        />
      ),
    },
  ]
}

interface PostsViewProps {
  posts: ApiPost[]
  users: UserOption[]
  totalPosts: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export default function PostsView({
  posts,
  users,
  totalPosts,
  totalPages,
  currentPage,
  pageSize,
}: PostsViewProps) {
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleView(id: string) {
    navigate(`/posts/${id}`)
  }

  function handleEdit(row: ApiPost) {
    setSelectedPost({
      id: row.id,
      title: row.title,
      body: row.body,
      status: row.status,
      userId: row.userId,
    })
    setSheetOpen(true)
  }

  function promptDelete(id: string) {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (deleteId == null) return
    setIsDeleting(true)
    const result = await deletePostAction(deleteId)
    setIsDeleting(false)
    setDeleteOpen(false)
    setDeleteId(null)
    if (result.success) {
      toast.success("Post deleted")
    } else {
      toast.error(result.error ?? "Failed to delete post")
    }
  }

  const columns = getColumns(users, handleView, handleEdit, promptDelete)

  const userFilterOptions: FilterOption[] = users.map((user) => ({
    label: user.name,
    value: user.id,
  }))

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Posts</PageTitle>
          <PageDescription>Manage your blog posts.</PageDescription>
        </div>
        <PageActions>
          <Button
            onClick={() => {
              setSelectedPost(undefined)
              setSheetOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          columns={columns}
          data={posts}
          toolbar={
            <DataTableToolbar
              searchPlaceholder="Search posts..."
              filterableColumns={[
                {
                  title: "Author",
                  paramKey: "userId",
                  options: userFilterOptions,
                },
                {
                  title: "Status",
                  paramKey: "status",
                  options: statusOptions,
                },
              ]}
            />
          }
          pagination={
            <DataTablePagination
              totalPosts={totalPosts}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          }
          emptyTitle="No posts found"
          emptyDescription="Try adjusting your search or filters."
        />
      </PageContent>
      <PostSheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        post={selectedPost}
        users={users}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Post"
        description="This will permanently remove the post. This action cannot be undone."
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </Page>
  )
}
