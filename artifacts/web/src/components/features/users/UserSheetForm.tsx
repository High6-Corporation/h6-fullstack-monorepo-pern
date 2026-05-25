
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
import { FormSection } from "@/components/shared/form/FormSection"
import {
  FormActions,
  SubmitButton,
  CancelButton,
} from "@/components/shared/form/FormActions"
import { InputField } from "@/components/shared/form/InputField"
import { createUserAction, updateUserAction } from "@/actions/user-actions"
import { toast } from "sonner"

const baseFields = {
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  contactNumber: z.string().optional(),
  avatar: z.string().optional(),
}

const createSchema = z.object({
  ...baseFields,
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const updateSchema = z.object(baseFields)

export type CreateUserFormValues = z.infer<typeof createSchema>
export type UpdateUserFormValues = z.infer<typeof updateSchema>

export interface User {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  contactNumber?: string
  avatar?: string
}

interface UserSheetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
}

const EMPTY_CREATE: CreateUserFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
  contactNumber: "",
  avatar: "",
}

export default function UserSheetForm({
  open,
  onOpenChange,
  user,
}: UserSheetFormProps) {
  const isEdit = !!user

  // Create and update share a form shape; `password` is only read in create
  // mode. Using a superset schema keeps the single component simple.
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(isEdit ? updateSchema : createSchema) as never,
    defaultValues: EMPTY_CREATE,
  })

  useEffect(() => {
    if (!open) return
    reset(
      user
        ? {
            firstName: user.firstName,
            middleName: user.middleName ?? "",
            lastName: user.lastName,
            email: user.email,
            password: "",
            contactNumber: user.contactNumber ?? "",
            avatar: user.avatar ?? "",
          }
        : EMPTY_CREATE
    )
  }, [open, user, reset])

  async function onSubmit(data: CreateUserFormValues) {
    const result = isEdit
      ? await updateUserAction(user!.id, {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.contactNumber,
          avatar: data.avatar,
        })
      : await createUserAction({
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          contactNumber: data.contactNumber,
          avatar: data.avatar,
        })

    if (result.success) {
      toast.success(isEdit ? "User updated" : "User created")
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
          <SheetTitle>{isEdit ? "Edit User" : "New User"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update user details." : "Create a new user."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <InputField
            control={control}
            name="firstName"
            label="First Name"
            autoComplete="firstName"
            required
          />

          <InputField control={control} name="middleName" label="Middle Name" />

          <InputField
            control={control}
            name="lastName"
            label="Last Name"
            autoComplete="lastName"
            required
          />

          <InputField
            control={control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />

          <InputField
            control={control}
            name="contactNumber"
            label="Contact Number"
            type="tel"
          />

          {!isEdit && (
            <InputField
              control={control}
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              required={!isEdit}
            />
          )}

          <FormActions>
            <CancelButton onClick={() => onOpenChange(false)}>
              Cancel
            </CancelButton>
            <SubmitButton isLoading={isSubmitting}>
              {isEdit ? "Save Changes" : "Create User"}
            </SubmitButton>
          </FormActions>
        </form>
      </SheetContent>
    </Sheet>
  )
}
