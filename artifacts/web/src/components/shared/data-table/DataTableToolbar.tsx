import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect, useCallback, useRef } from "react"

import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import { DataTableViewOptions } from "./DataTableViewOptions"
import { type FilterOption } from "./DataTableFacetedFilter"
import { Table } from "@tanstack/react-table"

interface DataTableToolbarProps<TData> {
  table?: Table<TData>
  searchPlaceholder?: string
  filterableColumns?: {
    title: string
    paramKey: string
    options: FilterOption[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  filterableColumns = [],
}: DataTableToolbarProps<TData>) {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const [searchParams, setSearchParams] = useSearchParams()

  // Local state for input value — prevents focus loss and allows debouncing
  const [inputValue, setInputValue] = useState(
    () => searchParams.get("search") ?? ""
  )

  // Track the last value we pushed to the URL to avoid redundant updates
  const lastPushedRef = useRef(inputValue)

  const updateUrlSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }
      params.delete("page")
      navigate(`${pathname}?${params.toString()}`, { replace: true })
      lastPushedRef.current = term
    },
    [pathname, navigate, searchParams]
  )

  // Debounced URL update: wait 300ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== lastPushedRef.current) {
        updateUrlSearch(inputValue)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, updateUrlSearch])

  // Sync input from URL on real browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const newValue = params.get("search") ?? ""
      setInputValue(newValue)
      lastPushedRef.current = newValue
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    for (const col of filterableColumns) {
      params.delete(col.paramKey)
    }
    params.delete("page")
    navigate(`${pathname}?${params.toString()}`, { replace: true })
    setInputValue("")
    lastPushedRef.current = ""
  }

  const searchValue = searchParams.get("search") ?? ""
  const hasFilters =
    searchValue ||
    filterableColumns.some((col) => searchParams.get(col.paramKey))

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-8 w-full pr-8 pl-8 shadow-xs"
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-0 h-8 w-8 -translate-y-1/2"
              onClick={() => {
                setInputValue("")
                updateUrlSearch("")
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        {filterableColumns.map((column) => (
          <DataTableFacetedFilter
            key={column.paramKey}
            title={column.title}
            options={column.options}
            paramKey={column.paramKey}
          />
        ))}
        {hasFilters && (
          <Button
            variant="secondary"
            onClick={resetFilters}
            className="h-8 px-2 shadow-xs lg:px-3"
          >
            Reset
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {table && <DataTableViewOptions table={table} />}
    </div>
  )
}
