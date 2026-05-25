import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/shared/view-page/Page"
import { useHelpCenterSettings } from "@/lib/api/settings"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpCenterPage() {
  const { data, isLoading } = useHelpCenterSettings()
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }
  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Help Center</PageTitle>
          <PageDescription>Get in touch with {data.companyName}.</PageDescription>
        </div>
      </PageHeader>
      <PageContent>
        <Card className="shadow-xs">
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.companyEmail && <div>Email: {data.companyEmail}</div>}
            {data.companyContactNumber && <div>Phone: {data.companyContactNumber}</div>}
            {data.companyWebsite && (
              <div>
                Website:{" "}
                <a href={data.companyWebsite} className="text-primary underline">
                  {data.companyWebsite}
                </a>
              </div>
            )}
            {data.userManual && (
              <div>
                <a href={data.userManual} className="text-primary underline">
                  Download user manual
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  )
}
