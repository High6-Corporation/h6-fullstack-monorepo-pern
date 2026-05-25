import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useTransition } from "react"

import { CheckIcon, PlusCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface DataTableFacetedFilterProps {
  title?: string
  options: FilterOption[]
  paramKey: string
}

export function DataTableFacetedFilter({
  title,
  options,
  paramKey,
}: DataTableFacetedFilterProps) {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const [searchParams, setSearchParams] = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const raw = searchParams.get(paramKey)
  const selectedValues = new Set(raw ? raw.split(",") : [])

  function toggleValue(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = new Set(params.get(paramKey)?.split(",") ?? [])

    if (current.has(value)) {
      current.delete(value)
    } else {
      current.add(value)
    }

    if (current.size === 0) {
      params.delete(paramKey)
    } else {
      params.set(paramKey, Array.from(current).join(","))
    }

    params.delete("page")
    startTransition(() => {
      navigate(`${pathname}?${params.toString()}`, { replace: true })
    })
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramKey)
    params.delete("page")
    startTransition(() => {
      navigate(`${pathname}?${params.toString()}`, { replace: true })
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed shadow-xs"
        >
          <PlusCircleIcon className="h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label ?? option.value}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value="clear-filters"
                    onSelect={clearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
