import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useTransition } from "react"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps {
  totalPages: number
  currentPage: number
  pageSize: number
  totalPosts: number
  pageSizeOptions?: number[]
}

export function DataTablePagination({
  totalPages,
  currentPage,
  pageSize,
  totalPosts,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps) {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const [searchParams, setSearchParams] = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function updatePageParam(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    startTransition(() => {
      navigate(`${pathname}?${params.toString()}`, { replace: true })
    })
  }

  return (
    <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="text-sm text-muted-foreground">
        {totalPosts} row(s) total.
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              updatePageParam({ perPage: value, page: "1" })
            }}
          >
            <SelectTrigger className="h-8 w-17.5 shadow-xs">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 shadow-xs lg:flex"
            onClick={() => updatePageParam({ page: "1" })}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 shadow-xs"
            onClick={() => updatePageParam({ page: String(currentPage - 1) })}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 shadow-xs"
            onClick={() => updatePageParam({ page: String(currentPage + 1) })}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 shadow-xs lg:flex"
            onClick={() => updatePageParam({ page: String(totalPages) })}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
