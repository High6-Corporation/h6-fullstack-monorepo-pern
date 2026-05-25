
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  FormActions,
  SubmitButton,
  CancelButton,
} from "@/components/shared/form/FormActions"
import { createCategoryAction, updateCategoryAction } from "@/actions/category-actions"
import { toast } from "sonner"
import { InputField } from "@/components/shared/form/InputField"
import { SelectField } from "@/components/shared/form/SelectField"
import { TextareaField } from "@/components/shared/form/TextareaField"

const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  isActive: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

export interface Category{
    id: string
    name: string
    description: string
    isActive: boolean
}

export interface CategoriesSheetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
}

export function CategoriesSheetForm({
  open,
  onOpenChange,
  category,
}: CategoriesSheetFormProps) {

  const isEdit = !!category
  const {
      handleSubmit,
      control,
      reset,
      formState: { isSubmitting },
    } = useForm<CategoryFormValues>({
      resolver: zodResolver(categoryFormSchema),
      defaultValues: {
        name: "",
        description: "",
        isActive: false,
      },
    })

    useEffect(() => {
      if (category) {
        reset(category)
      } else {
        reset({
          name: "",
          description: "",
          isActive: false,
        })
      }
    }, [open, category, reset])

    async function onSubmit(data: CategoryFormValues) {
      const result = isEdit 
        ? await updateCategoryAction(category?.id || "", data) 
        : await createCategoryAction(data)

      if (result.success) {
        toast.success(isEdit ? "Category updated" : "Category created")
        onOpenChange(false)
      } else {
        toast.error(result.error ?? "Something went wrong")
      }
    }

    return (
      <Sheet 
        open={open} 
        onOpenChange={(value) => {
          if (!value) reset()
          onOpenChange(value)
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader className="border-b">
            <SheetTitle>{isEdit ? "Edit Category" : "New Category"}</SheetTitle>
            <SheetDescription>{isEdit ? "Update category details." : "Enter category details."}</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <InputField
              control={control}
              name="name"
              label="Name"
              required
            />
            <TextareaField
              control={control}
              name="description"
              label="Description"
              required
            />
            <SelectField
              control={control}
              name="isActive"
              label="Status"
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              transformValue={(v) => v === "true"}
              required
            />
            <FormActions>
              <CancelButton onClick={() => onOpenChange(false)}>
                Cancel
              </CancelButton>
              <SubmitButton isLoading={isSubmitting}>
                {isEdit ? "Update" : "Create"}
              </SubmitButton>
            </FormActions>
          </form>
        </SheetContent>
      </Sheet>
    )
}
