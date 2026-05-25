import { useSearchParams } from "react-router-dom"
import UsersView from "@/components/features/users/UsersView"
import { DataTableSkeleton } from "@/components/shared/data-table/DataTableSkeleton"
import { useUsers } from "@/lib/api/users"

export default function UsersIndexPage() {
  const [params] = useSearchParams()
  const page = Math.max(1, Number(params.get("page")) || 1)
  const perPage = Math.max(1, Math.min(100, Number(params.get("perPage")) || 10))
  const search = params.get("search") ?? undefined

  const { data, isLoading } = useUsers({ page, perPage, q: search })

  if (isLoading || !data) return <DataTableSkeleton />

  return (
    <UsersView
      users={data.data}
      totalUsers={data.meta.total}
      totalPages={data.meta.last_page}
      currentPage={data.meta.current_page}
      pageSize={data.meta.per_page}
    />
  )
}
