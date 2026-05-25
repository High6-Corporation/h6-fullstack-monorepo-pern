import { useSearchParams } from "react-router-dom"
import CategoriesView from "@/components/features/categories/CategoriesView"
import { DataTableSkeleton } from "@/components/shared/data-table/DataTableSkeleton"
import { useCategories } from "@/lib/api/categories"
import type { Category as ApiCategory } from "@workspace/api-client-react/generated/index.schemas"
import type { Category } from "@/components/features/categories/CategoriesSheetForm"

export default function CategoriesIndexPage() {
  const [params] = useSearchParams()
  const page = Math.max(1, Number(params.get("page")) || 1)
  const perPage = Math.max(1, Math.min(100, Number(params.get("perPage")) || 10))
  const search = params.get("search") ?? undefined

  const { data: categoriesPage, isLoading } = useCategories({
    page,
    perPage,
    q: search,
  })

  if (isLoading || !categoriesPage) return <DataTableSkeleton />

  // Map API Category to local Category type
  const mappedCategories: Category[] = categoriesPage.data.map((cat: ApiCategory) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description ?? "",
    isActive: true, // Maps to API isActive field
  }))

  return (
    <CategoriesView
      categories={mappedCategories}
      totalCategories={categoriesPage.meta.total}
      totalPages={categoriesPage.meta.last_page}
      currentPage={categoriesPage.meta.current_page}
      pageSize={categoriesPage.meta.per_page}
    />
  )
}
