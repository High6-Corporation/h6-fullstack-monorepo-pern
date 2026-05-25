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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import UserSheetForm, {
  type User,
} from "@/components/features/users/UserSheetForm"
import { type User as ApiUser } from "@/types/api"

import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog/DeleteConfirmDialog"
import { deleteUserAction } from "@/actions/user-actions"
import { getUserDisplayName, getUserInitials } from "@/lib/utils"
import { Pencil, Trash2, Mail, Phone } from "lucide-react"
import { toast } from "sonner"

interface UserDetailViewProps {
  user: ApiUser
}

export default function UserDetailView({ user }: UserDetailViewProps) {
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const displayName = getUserDisplayName(user)
  const sheetUser: User = {
    id: user.id,
    firstName: user.firstName,
    middleName: user.middleName ?? undefined,
    lastName: user.lastName,
    email: user.email,
    contactNumber: user.contactNumber ?? undefined,
    avatar: user.avatar ?? undefined,
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteUserAction(user.id)
    setIsDeleting(false)
    setDeleteOpen(false)
    if (result.success) {
      toast.success("User deleted")
      navigate("/users")
    } else {
      toast.error(result.error ?? "Failed to delete user")
    }
  }

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={displayName} />
            ) : null}
            <AvatarFallback className="rounded-full text-base">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <PageTitle>{displayName}</PageTitle>
            <PageDescription>{user.email}</PageDescription>
          </div>
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
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${user.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {user.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contact Number
                  </p>
                  <p className="font-medium">
                    {user.contactNumber ?? (
                      <span className="text-muted-foreground">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Name Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Middle Name</p>
                <p className="font-medium">
                  {user.middleName ?? (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{user.lastName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
      <UserSheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={sheetUser}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description="This will permanently remove the user. This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Page>
  )
}
