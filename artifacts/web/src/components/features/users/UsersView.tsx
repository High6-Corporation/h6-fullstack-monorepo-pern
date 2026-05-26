import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import { ColumnDef } from "@tanstack/react-table"
import { useQueryClient } from "@tanstack/react-query"
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
} from "@/components/shared/view-page/Page"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DataTable } from "@/components/shared/data-table/DataTable"
import { DataTableToolbar } from "@/components/shared/data-table/DataTableToolbar"
import { DataTablePagination } from "@/components/shared/data-table/DataTablePagination"
import { RowActions } from "@/components/shared/row-actions/RowActions"
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog/DeleteConfirmDialog"
import UserSheetForm, {
  type User,
} from "@/components/features/users/UserSheetForm"
import { type User as ApiUser } from "@/types/api"
import { deleteUserAction } from "@/actions/user-actions"
import { getGetUsersQueryKey } from "@workspace/api-client-react/generated/users/users"
import { getUserDisplayName, getUserInitials } from "@/lib/utils"
import { Plus } from "lucide-react"
import { toast } from "sonner"

function getColumns(
  onView: (id: string) => void,
  onEdit: (user: ApiUser) => void,
  onDelete: (id: string) => void
): ColumnDef<ApiUser>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => getUserDisplayName(row),
      header: "Name",
      cell: ({ row }) => {
        const user = row.original
        const displayName = getUserDisplayName(user)
        return (
          <Link to={`/users/${user.id}`}
            className="flex items-center gap-3 font-medium hover:underline"
          >
            <Avatar className="size-8">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={displayName} />
              ) : null}
              <AvatarFallback className="rounded-full">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <span>{displayName}</span>
          </Link>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <a
          href={`mailto:${row.getValue("email")}`}
          className="text-primary hover:underline"
        >
          {row.getValue("email")}
        </a>
      ),
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
      cell: ({ row }) =>
        row.original.contactNumber ?? (
          <span className="text-muted-foreground">—</span>
        ),
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

interface UsersViewProps {
  users: ApiUser[]
  totalUsers: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export default function UsersView({
  users,
  totalUsers,
  totalPages,
  currentPage,
  pageSize,
}: UsersViewProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleView(id: string) {
    navigate(`/users/${id}`)
  }

  function handleEdit(row: ApiUser) {
    setSelectedUser({
      id: row.id,
      firstName: row.firstName,
      middleName: row.middleName ?? undefined,
      lastName: row.lastName,
      email: row.email,
      contactNumber: row.contactNumber ?? undefined,
      avatar: row.avatar ?? undefined,
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
    const result = await deleteUserAction(deleteId)
    setIsDeleting(false)
    setDeleteOpen(false)
    setDeleteId(null)
    if (result.success) {
      toast.success("User deleted")
      await queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() })
    } else {
      toast.error(result.error ?? "Failed to delete user")
    }
  }

  const columns = getColumns(handleView, handleEdit, promptDelete)

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Users</PageTitle>
          <PageDescription>Manage system users.</PageDescription>
        </div>
        <PageActions>
          <Button
            onClick={() => {
              setSelectedUser(undefined)
              setSheetOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            New User
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          columns={columns}
          data={users}
          toolbar={<DataTableToolbar searchPlaceholder="Search users..." />}
          pagination={
            <DataTablePagination
              totalPosts={totalUsers}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          }
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search."
        />
      </PageContent>
      <UserSheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={selectedUser}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description="This will permanently remove the user. This action cannot be undone."
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </Page>
  )
}
