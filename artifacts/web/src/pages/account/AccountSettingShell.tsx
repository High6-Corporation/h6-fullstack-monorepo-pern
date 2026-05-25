import { AccountNav } from "@/components/shared/account-nav/AccountNav"
import {
    Page,
    PageHeader,
    PageTitle,
    PageDescription,
    PageContent,
} from "@/components/shared/view-page/Page"

interface AccountSettingShellProps {
    children: React.ReactNode
}
export function AccountSettingShell({ children }: AccountSettingShellProps) {
    return (
        <Page>
            <PageHeader>
                <div>
                    <PageTitle>Account Settings</PageTitle>
                    <PageDescription>Manage your account settings and preferences.</PageDescription>
                </div>
            </PageHeader>
            <PageContent>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <aside className="w-full shrink-0 lg:w-[180px]">
                        <AccountNav />
                    </aside>
                    <div className="min-w-0 flex-1">
                        {children}
                    </div>
                </div>
            </PageContent>
        </Page>
    )
}
