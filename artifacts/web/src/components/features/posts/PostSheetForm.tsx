
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
import { createPostAction, updatePostAction } from "@/actions/post-actions"
import { toast } from "sonner"
import { InputField } from "@/components/shared/form/InputField"
import { SelectField } from "@/components/shared/form/SelectField"
import { TextareaField } from "@/components/shared/form/TextareaField"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  status: z.enum(["published", "draft"]),
  userId: z.string().min(1, "Author is required"),
})

export type PostFormValues = z.infer<typeof postSchema>

export interface Post {
  id: string
  title: string
  body: string
  status: "published" | "draft"
  userId: string
}

export interface UserOption {
  id: string
  name: string
}

interface PostSheetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: Post
  users: UserOption[]
}

export default function PostSheetForm({
  open,
  onOpenChange,
  post,
  users,
}: PostSheetFormProps) {
  const isEdit = !!post

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      status: "draft" as const,
      userId: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        post ?? {
          title: "",
          body: "",
          status: "draft" as const,
          userId: "",
        }
      )
    }
  }, [open, post, reset])

  async function onSubmit(data: PostFormValues) {
    const result = isEdit
      ? await updatePostAction(post!.id, data)
      : await createPostAction(data)

    if (result.success) {
      toast.success(isEdit ? "Post updated" : "Post created")
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
          <SheetTitle>{isEdit ? "Edit Post" : "New Post"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update post content." : "Create a new post."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <InputField control={control} name="title" label="Title" required />

          <SelectField
            control={control}
            name="userId"
            label="Author"
            placeholder="Select author"
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            required
          />

          <SelectField
            control={control}
            name="status"
            label="Status"
            placeholder="Select status"
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
            required
          />

          <TextareaField
            control={control}
            name="body"
            label="Body"
            rows={6}
            required
          />

          <FormActions>
            <CancelButton onClick={() => onOpenChange(false)}>
              Cancel
            </CancelButton>
            <SubmitButton isLoading={isSubmitting}>
              {isEdit ? "Save Changes" : "Create Post"}
            </SubmitButton>
          </FormActions>
        </form>
      </SheetContent>
    </Sheet>
  )
}
