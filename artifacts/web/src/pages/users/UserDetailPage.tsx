import { useParams } from "react-router-dom"
import { useUser } from "@/lib/api/users"
import { Spinner } from "@/components/ui/spinner"
import UserDetailView from "@/components/features/users/UserDetailView"

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading, error } = useUser(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }
  if (error || !user) {
    return (
      <div className="p-8 text-muted-foreground">User not found.</div>
    )
  }
  return <UserDetailView user={user} />
}
