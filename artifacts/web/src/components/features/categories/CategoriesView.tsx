import { useNavigate } from "react-router-dom"
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
} from "@/components/shared/data-table/DataTable"
import { DataTableToolbar } from "@/components/shared/data-table/DataTableToolbar"
import { DataTablePagination } from "@/components/shared/data-table/DataTablePagination"
import { RowActions } from "@/components/shared/row-actions/RowActions"
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog/DeleteConfirmDialog"
import { CategoriesSheetForm, type Category } from "@/components/features/categories/CategoriesSheetForm"
import { deleteCategoryAction } from "@/actions/category-actions"
import { Plus } from "lucide-react"
import { toast } from "sonner"

function getColumns(
  onView: (id: string) => void,
  onEdit: (category: Category) => void,
  onDelete: (id: string) => void
): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description
        return (
          <span className="max-w-md truncate" title={description}>
            {description}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.isActive
        return (
          <Badge variant={status ? "default" : "secondary"}>
            {status ? "Active" : "Inactive"}
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

interface CategoriesViewProps {
  categories: Category[]
  totalCategories: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export default function CategoriesView({
  categories,
  totalCategories,
  totalPages,
  currentPage,
  pageSize,
}: CategoriesViewProps) {
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleView(id: string) {
    navigate(`/categories/${id}`)
  }

  function handleEdit(category: Category) {
    setSelectedCategory(category)
    setSheetOpen(true)
  }

  function promptDelete(id: string) {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (deleteId == null) return
    setIsDeleting(true)
    const result = await deleteCategoryAction(deleteId)
    setIsDeleting(false)
    setDeleteOpen(false)
    setDeleteId(null)
    if (result.success) {
      toast.success("Category deleted")
    } else {
      toast.error(result.error ?? "Failed to delete category")
    }
  }

  const columns = getColumns(handleView, handleEdit, promptDelete)

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Categories</PageTitle>
          <PageDescription>Manage your categories.</PageDescription>
        </div>
        <PageActions>
          <Button
            onClick={() => {
              setSelectedCategory(undefined)
              setSheetOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          columns={columns}
          data={categories}
          toolbar={
            <DataTableToolbar
              searchPlaceholder="Search categories..."
            />
          }
          pagination={
            <DataTablePagination
              totalPosts={totalCategories}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          }
          emptyTitle="No categories found"
          emptyDescription="Try adjusting your search or filters."
        />
      </PageContent>
      <CategoriesSheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={selectedCategory}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Category"
        description="This will permanently remove the category. This action cannot be undone."
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </Page>
  )
}
