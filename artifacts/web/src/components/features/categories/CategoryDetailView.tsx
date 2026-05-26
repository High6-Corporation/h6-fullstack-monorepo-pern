import { useNavigate } from "react-router-dom"
import { useState } from "react"
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoriesSheetForm, type Category } from "@/components/features/categories/CategoriesSheetForm"
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog/DeleteConfirmDialog"
import { deleteCategoryAction } from "@/actions/category-actions"
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { getGetCategoriesQueryKey } from "@workspace/api-client-react/generated/categories/categories"

interface CategoryDetailViewProps {
  category: Category
}

export default function CategoryDetailView({
  category,
}: CategoryDetailViewProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isActive = category.isActive

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteCategoryAction(category.id)
    setIsDeleting(false)
    setDeleteOpen(false)
    if (result.success) {
      toast.success("Category deleted")
      await queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() })
      navigate("/categories")
    } else {
      toast.error(result.error ?? "Failed to delete category")
    }
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>{category.name}</PageTitle>
          <PageDescription>
            <span className="flex items-center gap-2">
              {isActive ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              {isActive ? "Active" : "Inactive"}
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
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Category #{category.id}
          </span>
        </div>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-wrap">
              {category.description}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="font-medium">{category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category ID
                </p>
                <p className="text-sm font-mono">{category.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContent>
      <CategoriesSheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={category}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Category"
        description="This will permanently remove the category. This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Page>
  )
}
