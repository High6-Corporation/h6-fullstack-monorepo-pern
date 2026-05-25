import { useSearchParams } from "react-router-dom"
import { DataTableSkeleton } from "@/components/shared/data-table/DataTableSkeleton"
import DepartmentsView from "@/components/features/departments/DepartmentsView"
import { useDepartments } from "@/lib/api/departments"

export default function DepartmentsIndexPage() {
  const [params] = useSearchParams()
  const page = Math.max(1, Number(params.get("page")) || 1)
  const perPage = Math.max(1, Math.min(100, Number(params.get("perPage")) || 20))
  const search = params.get("search") ?? undefined

  const { data, isLoading } = useDepartments({ page, perPage, q: search })

  if (isLoading || !data) return <DataTableSkeleton />

  return (
    <DepartmentsView
      departments={data.data}
      totalDepartments={data.meta.total}
    />
  )
}
