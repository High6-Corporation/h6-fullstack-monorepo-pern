import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/shared/view-page/Page"
import { StatCard } from "@/components/shared/stat-card/StatCard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Briefcase, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Overview of your sales pipeline and key metrics.
          </PageDescription>
        </div>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Deals" value="24" description="vs last month" trend="up" trendValue="+12%" icon={Briefcase} />
          <StatCard title="Won Deals" value="8" description="vs last month" trend="up" trendValue="+25%" icon={CheckCircle2} />
          <StatCard title="Pipeline Value" value="$1.2M" description="vs last month" trend="up" trendValue="+8%" icon={TrendingUp} />
          <StatCard title="Conversion Rate" value="33%" description="vs last month" trend="down" trendValue="-2%" icon={BarChart3} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2 shadow-xs">
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Activity feed would appear here.</p></CardContent>
          </Card>
          <Card className="shadow-xs">
            <CardHeader><CardTitle>Upcoming Tasks</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Task list would appear here.</p></CardContent>
          </Card>
        </div>
      </PageContent>
    </Page>
  )
}
