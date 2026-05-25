import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/shared/view-page/Page"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Settings</PageTitle>
          <PageDescription>Manage your system settings and preferences.</PageDescription>
        </div>
      </PageHeader>
      <PageContent>{children}</PageContent>
    </Page>
  )

}