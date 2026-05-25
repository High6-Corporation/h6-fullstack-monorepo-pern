import type { Department } from "@workspace/api-client-react/generated/index.schemas"
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/shared/view-page/Page"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface DepartmentsViewProps {
  departments: Department[]
  totalDepartments: number
}

export default function DepartmentsView({
  departments,
  totalDepartments,
}: DepartmentsViewProps) {
  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Departments</PageTitle>
          <PageDescription>
            Gold-standard sample module for Controller → Service → Query → React.
          </PageDescription>
        </div>
      </PageHeader>

      <PageContent>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No departments found. Add sample records through the API or seed script.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {department.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={department.isActive ? "default" : "secondary"}>
                        {department.isActive ? "Active" : "Archived"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Total records: {totalDepartments}
        </p>
      </PageContent>
    </Page>
  )
}
