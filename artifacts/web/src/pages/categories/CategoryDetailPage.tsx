import { useParams } from "react-router-dom"
import CategoryDetailView from "@/components/features/categories/CategoryDetailView"
import { Spinner } from "@/components/ui/spinner"
import { useCategory } from "@/lib/api/categories"
import type { Category as ApiCategory } from "@workspace/api-client-react/generated/index.schemas"
import type { Category } from "@/components/features/categories/CategoriesSheetForm"

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: apiCategory, isLoading } = useCategory(id)

  if (isLoading || !apiCategory) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }

  // Map API Category to local Category type
  const category: Category = {
    id: apiCategory.id,
    name: apiCategory.name,
    description: apiCategory.description ?? "",
    isActive: true, // Maps to API isActive field
  }

  return <CategoryDetailView category={category} />
}
