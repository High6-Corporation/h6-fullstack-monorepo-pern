
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/shared/view-page/Page"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { InputField } from "@/components/shared/form/InputField"
import { TextareaField } from "@/components/shared/form/TextareaField"
import { SelectField } from "@/components/shared/form/SelectField"
import { ComboboxField } from "@/components/shared/form/ComboboxField"
import { ComboboxAutoloadField } from "@/components/shared/form/ComboboxAutoloadField"
import { CheckboxField } from "@/components/shared/form/CheckboxField"
import { SwitchField } from "@/components/shared/form/SwitchField"
import { RadioGroupField } from "@/components/shared/form/RadioGroupField"
import { DatePickerField } from "@/components/shared/form/DatePickerField"
import { DateRangePickerField } from "@/components/shared/form/DateRangePickerField"
import { FormSection } from "@/components/shared/form/FormSection"
import {
  FormActions,
  SubmitButton,
  CancelButton,
} from "@/components/shared/form/FormActions"
import { searchPostsAction } from "@/actions/post-actions"

// --- Schema with validation for every field type ---

const formTestSchema = z.object({
  // InputField
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Must be a valid email"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  // TextareaField
  bio: z.string().min(10, "Bio must be at least 10 characters"),

  // SelectField
  role: z.string().min(1, "Role is required"),
  status: z.string().optional(),

  // ComboboxField
  country: z.string().min(1, "Country is required"),

  // ComboboxAutoloadField
  favoritePost: z.string().optional(),

  // CheckboxField
  agreeToTerms: z.boolean().refine((v) => v === true, "You must agree"),
  subscribeNewsletter: z.boolean().optional(),

  // SwitchField
  emailNotifications: z.boolean().optional(),
  darkMode: z.boolean().optional(),

  // RadioGroupField
  priority: z.string().min(1, "Priority is required"),
  experience: z.string().optional(),

  // DatePickerField
  startDate: z.date().optional(),
  deadline: z.date({ message: "Deadline is required" }),

  // DateRangePickerField
  eventDates: z
    .object({ from: z.date().optional(), to: z.date().optional() })
    .optional(),

  // EditorField
  content: z.any().optional(),
})

type FormTestValues = z.infer<typeof formTestSchema>

// --- Static option data ---

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
]

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended", disabled: true },
]

const countryOptions = [
  { value: "ph", label: "Philippines" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "br", label: "Brazil" },
  { value: "in", label: "India" },
  { value: "sg", label: "Singapore" },
]

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const experienceOptions = [
  { value: "junior", label: "Junior (0-2 years)" },
  { value: "mid", label: "Mid (3-5 years)" },
  { value: "senior", label: "Senior (6+ years)" },
]

const EMPTY_DEFAULTS: Partial<FormTestValues> = {
  firstName: "",
  email: "",
  website: "",
  bio: "",
  role: "",
  status: "",
  country: "",
  favoritePost: "01KR0RT4GPP7Q6B7N52DV03KSZ",
  agreeToTerms: false,
  subscribeNewsletter: false,
  emailNotifications: true,
  darkMode: false,
  priority: "",
  experience: "",
  startDate: undefined,
  deadline: undefined,
  eventDates: undefined,
  content: undefined,
}

export default function FormTestView() {
  const [submittedData, setSubmittedData] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<FormTestValues>({
    resolver: zodResolver(formTestSchema) as never,
    defaultValues: EMPTY_DEFAULTS,
  })

  async function onSubmit(data: FormTestValues) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Convert Dates to ISO strings for display
    const serializable = {
      ...data,
      startDate: data.startDate?.toISOString() ?? null,
      deadline: data.deadline?.toISOString() ?? null,
      eventDates: data.eventDates
        ? {
            from: data.eventDates.from?.toISOString() ?? null,
            to: data.eventDates.to?.toISOString() ?? null,
          }
        : null,
    }
    setSubmittedData(JSON.stringify(serializable, null, 2))
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Form Field Test</PageTitle>
          <PageDescription>
            Test all shared form field components and their validation behavior.
          </PageDescription>
        </div>
      </PageHeader>
      <PageContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* --- Text Inputs --- */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Text Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSection
                title="Input Fields"
                description="InputField with various types and validation."
              >
                <InputField
                  control={control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  required
                />
                <InputField
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="email"
                  required
                />
                <InputField
                  control={control}
                  name="website"
                  label="Website"
                  type="url"
                  placeholder="https://example.com"
                  description="Must be a valid URL if provided."
                />
              </FormSection>
              <FormSection
                title="Textarea"
                description="TextareaField with min-length validation."
              >
                <TextareaField
                  control={control}
                  name="bio"
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  required
                />
              </FormSection>
            </CardContent>
          </Card>

          {/* --- Selection Fields --- */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Selection Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSection
                title="Select"
                description="SelectField — short lists with no search."
              >
                <SelectField
                  control={control}
                  name="role"
                  label="Role"
                  placeholder="Select a role"
                  options={roleOptions}
                  required
                />
                <SelectField
                  control={control}
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  options={statusOptions}
                  description="'Suspended' is disabled to show disabled option behavior."
                />
              </FormSection>
              <FormSection
                title="Combobox"
                description="ComboboxField — searchable select with 10+ options."
              >
                <ComboboxField
                  control={control}
                  name="country"
                  label="Country"
                  placeholder="Search countries..."
                  options={countryOptions}
                  required
                  description="Type to filter. Click to select."
                />
              </FormSection>
              <FormSection
                title="Combobox Autoload"
                description="ComboboxAutoloadField — server-side search with infinite scroll for 100+ options."
              >
                <ComboboxAutoloadField
                  control={control}
                  name="favoritePost"
                  label="Favorite Post"
                  placeholder="Search posts..."
                  fetchOptions={searchPostsAction}
                  description="Fetches posts from the database with server-side search and infinite scroll."
                />
              </FormSection>
              <FormSection
                title="Radio Group"
                description="RadioGroupField — all options visible at once."
              >
                <RadioGroupField
                  control={control}
                  name="priority"
                  label="Priority"
                  options={priorityOptions}
                  required
                />
                <RadioGroupField
                  control={control}
                  name="experience"
                  label="Experience Level"
                  options={experienceOptions}
                  direction="horizontal"
                  description="Horizontal layout variant."
                />
              </FormSection>
            </CardContent>
          </Card>

          {/* --- Boolean Fields --- */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Boolean Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSection
                title="Checkbox"
                description="CheckboxField — consent/acknowledgment."
              >
                <CheckboxField
                  control={control}
                  name="agreeToTerms"
                  label="I agree to the terms and conditions"
                  required
                />
                <CheckboxField
                  control={control}
                  name="subscribeNewsletter"
                  label="Subscribe to newsletter"
                  description="Receive periodic updates via email."
                />
              </FormSection>
              <FormSection
                title="Switch"
                description="SwitchField — toggles/preferences."
              >
                <SwitchField
                  control={control}
                  name="emailNotifications"
                  label="Email Notifications"
                  description="Receive email updates about your account."
                />
                <SwitchField
                  control={control}
                  name="darkMode"
                  label="Dark Mode"
                  size="sm"
                  description="Small size variant."
                />
              </FormSection>
            </CardContent>
          </Card>

          {/* --- Date Fields --- */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Date Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSection
                title="Date Picker"
                description="DatePickerField — single date selection."
              >
                <DatePickerField
                  control={control}
                  name="startDate"
                  label="Start Date"
                  description="Optional date field."
                />
                <DatePickerField
                  control={control}
                  name="deadline"
                  label="Deadline"
                  placeholder="Select deadline"
                  dateFormat="yyyy-MM-dd"
                  required
                  description="Required date with custom format (yyyy-MM-dd)."
                />
              </FormSection>
              <FormSection
                title="Date Range Picker"
                description="DateRangePickerField — from/to date range."
              >
                <DateRangePickerField
                  control={control}
                  name="eventDates"
                  label="Event Dates"
                  description="Select a start and end date."
                />
              </FormSection>
            </CardContent>
          </Card>

          {/* --- Actions --- */}
          <FormActions>
            <CancelButton
              onClick={() => {
                reset()
                setSubmittedData(null)
              }}
            >
              Reset
            </CancelButton>
            <SubmitButton isLoading={isSubmitting}>Submit</SubmitButton>
          </FormActions>
        </form>

        {/* --- Submitted Data Preview --- */}
        {submittedData && (
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Submitted Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                {submittedData}
              </pre>
            </CardContent>
          </Card>
        )}
      </PageContent>
    </Page>
  )
}
