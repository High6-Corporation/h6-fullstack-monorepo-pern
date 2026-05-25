import { SettingsNav } from "@/components/shared/settings-nav/SettingsNav"
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/shared/view-page/Page"

interface SettingsShellProps {
  children: React.ReactNode
}

export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Settings</PageTitle>
          <PageDescription>Manage your system settings and preferences.</PageDescription>
        </div>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:w-[180px]">
            <SettingsNav />
          </aside>
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </PageContent>
    </Page>
  )
}
