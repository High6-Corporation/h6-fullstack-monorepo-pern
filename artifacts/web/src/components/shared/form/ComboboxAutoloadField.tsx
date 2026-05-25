
import { useState, useRef, useCallback, useEffect } from "react"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

// --- Types ---

export interface ComboboxAutoloadOption {
  value: string
  label: string
  disabled?: boolean
}

export interface FetchOptionsParams {
  q?: string
  page: number
  perPage: number
  /** Current form value — server should ensure this option is included in results */
  selectedValue?: string
}

export interface FetchOptionsResult {
  data: ComboboxAutoloadOption[]
  hasMore: boolean
}

interface ComboboxAutoloadFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string | number,
> {
  /** Form control from react-hook-form */
  control: Control<TFieldValues>
  /** Field name in the form schema */
  name: Path<TFieldValues>
  /** Label displayed above the combobox */
  label: string
  /** Optional description rendered below the combobox */
  description?: string
  /** Placeholder text when no value is selected (default: "Search...") */
  placeholder?: string
  /**
   * Server Action that fetches options from the database.
   * Must return `{ data: ComboboxAutoloadOption[], hasMore: boolean }`.
   */
  fetchOptions: (params: FetchOptionsParams) => Promise<FetchOptionsResult>
  /** Disable the combobox */
  disabled?: boolean
  /** Mark field as required */
  required?: boolean
  /** Items per page (default: 10) */
  perPage?: number
  /** Debounce delay in ms for search input (default: 300) */
  debounceMs?: number
  /** Cache freshness in ms — background refresh triggers after this (default: 30000) */
  staleTime?: number
  /** Transform option value before setting (default: identity) */
  transformValue?: (value: string) => TFieldValue
}

// --- Default stale timestamp so first open always fetches ---
const NEVER_FETCHED = 0

/**
 * Reusable combobox field with infinite scroll and debounced search,
 * fetching options from the database via a Server Action.
 *
 * Use `ComboboxAutoloadField` for large lists (100+ options) that need
 * search + infinite scroll from the database.
 * Use `ComboboxField` for medium lists (10-100 options, static array).
 * Use `SelectField` for short lists (under 10 options, no search).
 *
 * ### Cache + background refresh
 *
 * - Options are retained in local state so they appear instantly on re-open.
 * - After `staleTime` (default 30s), a background refresh re-fetches the
 *   same pages that were already loaded, replacing data in-place without
 *   a loading flash. This keeps labels accurate (e.g., a user's name change).
 * - Typing a search query always fetches fresh data (clears cache).
 *
 * ### Usage
 *
 * First, create a Server Action:
 * ```ts
 * // actions/user-actions.ts
 * export async function searchUsersAction({ q, page, perPage }: FetchOptionsParams) {
 *   const result = await getUsers({ q, page, perPage })
 *   return {
 *     data: result.data.map((u) => ({
 *       value: String(u.id),
 *       label: getUserDisplayName(u) || u.email,
 *     })),
 *     hasMore: result.meta.current_page < result.meta.last_page,
 *   }
 * }
 * ```
 *
 * Then use the field:
 * ```tsx
 * <ComboboxAutoloadField
 *   control={control}
 *   name="userId"
 *   label="Author"
 *   placeholder="Search users..."
 *   fetchOptions={searchUsersAction}
 *   transformValue={(v) => Number(v)}
 * />
 * ```
 */
export function ComboboxAutoloadField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldValue = string,
>({
  control,
  name,
  label,
  description,
  placeholder = "Search...",
  fetchOptions,
  disabled = false,
  required = false,
  perPage = 10,
  debounceMs = 300,
  staleTime = 30000,
  transformValue = (v) => v as unknown as TFieldValue,
}: ComboboxAutoloadFieldProps<TFieldValues, TFieldValue>) {
  // --- State (only values that drive render output) ---
  const [options, setOptions] = useState<ComboboxAutoloadOption[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // --- Refs ---
  const pageRef = useRef(1) // current page (no render dependency)
  const loadedPages = useRef(0) // total loaded pages for background refresh
  const lastFetchedAt = useRef<number>(NEVER_FETCHED)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchIdRef = useRef(0) // incrementing request ID — prevents stale responses
  const isRefreshingRef = useRef(false) // background refresh guard (no render dependency)
  const isFetchingMoreRef = useRef(false) // infinite scroll guard (no render dependency)
  const searchQueryRef = useRef("") // tracks the active search query
  const isSelectionRef = useRef(false) // skips onInputValueChange after selection/clear
  const currentValueRef = useRef<string | undefined>(undefined) // current form value for server-side inclusion

  // --- Fetch logic ---

  const fetchPage = useCallback(
    async (q: string, pageNum: number, append: boolean) => {
      if (append) {
        // Guard against duplicate infinite-scroll fetches
        if (isFetchingMoreRef.current) return
        isFetchingMoreRef.current = true
      } else {
        // Increment request ID to invalidate any in-flight non-append fetches
        ++fetchIdRef.current
        setIsLoading(true)
      }

      const currentFetchId = fetchIdRef.current

      try {
        const result = await fetchOptions({
          q: q || undefined,
          page: pageNum,
          perPage,
          selectedValue: currentValueRef.current || undefined,
        })

        // Discard if superseded by a newer fetch (search typed while this was in-flight)
        if (currentFetchId !== fetchIdRef.current) return

        if (append) {
          setOptions((prev) => {
            const existing = new Set(prev.map((o) => o.value))
            const newItems = result.data.filter((o) => !existing.has(o.value))
            return [...prev, ...newItems]
          })
        } else {
          setOptions(result.data)
        }

        setHasMore(result.hasMore)
        pageRef.current = pageNum
        loadedPages.current = Math.max(loadedPages.current, pageNum)
        lastFetchedAt.current = Date.now()
      } catch {
        // Silently ignore — options retain previous state
      } finally {
        if (append) {
          isFetchingMoreRef.current = false
        } else if (currentFetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    },
    [fetchOptions, perPage]
  )

  // --- Background refresh ---

  const backgroundRefresh = useCallback(async () => {
    if (isRefreshingRef.current || loadedPages.current === 0) return

    isRefreshingRef.current = true
    const fetchIdAtStart = fetchIdRef.current

    try {
      const q = searchQueryRef.current
      const pages = Array.from({ length: loadedPages.current }, (_, i) =>
        fetchOptions({
          q: q || undefined,
          page: i + 1,
          perPage,
          selectedValue: currentValueRef.current || undefined,
        })
      )
      const results = await Promise.all(pages)

      // Discard if a search was triggered or component unmounted while refreshing
      if (fetchIdRef.current !== fetchIdAtStart) return

      const allOptions = results.flatMap((r) => r.data)
      // Deduplicate by value (keep last occurrence)
      const seen = new Set<string>()
      const deduped = [...allOptions]
        .reverse()
        .filter((o) => {
          if (seen.has(o.value)) return false
          seen.add(o.value)
          return true
        })
        .reverse()

      setOptions(deduped)
      setHasMore(results[results.length - 1]?.hasMore ?? false)
      lastFetchedAt.current = Date.now()
    } catch {
      // Silently ignore — retained options stay
    } finally {
      isRefreshingRef.current = false
    }
  }, [fetchOptions, perPage])

  // --- Debounced search ---

  const handleSearchChange = useCallback(
    (value: string) => {
      const prevQuery = searchQueryRef.current

      // Skip if value hasn't changed — prevents re-fetch on popup open/close
      if (value === prevQuery) return

      searchQueryRef.current = value

      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      // User cleared the search after previously searching → re-fetch all from page 1
      if (!value.trim() && prevQuery.trim()) {
        debounceTimer.current = setTimeout(() => {
          loadedPages.current = 0
          fetchPage("", 1, false)
        }, debounceMs)
        return
      }

      // User typed a new search query → fetch filtered results from page 1
      if (value.trim()) {
        debounceTimer.current = setTimeout(() => {
          loadedPages.current = 0
          fetchPage(value, 1, false)
        }, debounceMs)
      }

      // value is empty AND prev was also empty → keep existing data, no re-fetch
    },
    [debounceMs, fetchPage]
  )

  // --- Infinite scroll ---

  const handleListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const threshold = 40
      const atBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - threshold

      if (atBottom && !isLoading && hasMore && !isFetchingMoreRef.current) {
        fetchPage(searchQueryRef.current, pageRef.current + 1, true)
      }
    },
    [isLoading, hasMore, fetchPage]
  )

  // --- Cleanup on unmount ---

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      fetchIdRef.current++ // Invalidate any in-flight fetches
    }
  }, [])

  // --- Pre-fetch on mount if there's a default value ---

  useEffect(() => {
    if (currentValueRef.current && loadedPages.current === 0) {
      fetchPage("", 1, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Render ---

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const stringValue =
          field.value != null ? String(field.value) : undefined

        // Keep ref in sync so fetchPage always includes the current value
        currentValueRef.current = stringValue

        return (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor={name}>
              {label}
              {!required && (
                <Badge variant="outline" className="text-muted-foreground">
                  Optional
                </Badge>
              )}
            </FieldLabel>
            <Combobox
              items={options}
              value={
                stringValue
                  ? (options.find((o) => o.value === stringValue) ?? null)
                  : null
              }
              onValueChange={(v) => {
                if (v != null && typeof v === "object" && "value" in v) {
                  field.onChange(transformValue(String(v.value)))
                  isSelectionRef.current = true // selection will trigger onInputValueChange with label — skip it
                } else {
                  field.onChange("") // clear the form value — use "" not undefined to avoid react-hook-form reverting to defaultValues
                  currentValueRef.current = undefined // prevent server from re-including the cleared value
                  isSelectionRef.current = true // clear will trigger onInputValueChange with "" — skip it
                  // Re-fetch the full unfiltered list after clearing
                  if (loadedPages.current > 0) {
                    loadedPages.current = 0
                    fetchPage("", 1, false)
                  }
                }
              }}
              filter={null}
              onOpenChange={(open) => {
                if (open) {
                  const isStale = Date.now() - lastFetchedAt.current > staleTime
                  if (loadedPages.current === 0) {
                    fetchPage("", 1, false)
                  } else if (isStale) {
                    backgroundRefresh()
                  }
                }
              }}
              onInputValueChange={(inputValue) => {
                // After a selection or clear, Base UI fires onInputValueChange with the
                // label or empty string. We skip it so the label isn't treated as a
                // search query. We do NOT update searchQueryRef here — it must only
                // reflect the user's actual search text, not the selected label.
                if (isSelectionRef.current) {
                  isSelectionRef.current = false
                  return
                }

                // When options load and the Combobox finds a matching value, it syncs
                // the label to the input, firing onInputValueChange with the label text.
                // That label would be treated as a search query, replacing the full
                // list with a single match. Skip it — do NOT set searchQueryRef to
                // the label.
                if (stringValue) {
                  const match = options.find((o) => o.value === stringValue)
                  if (match && inputValue === match.label) {
                    return
                  }
                }

                handleSearchChange(inputValue)
              }}
              disabled={disabled}
            >
              <ComboboxInput
                id={name}
                placeholder={placeholder}
                aria-invalid={!!fieldState.error}
                className={cn("shadow-xs")}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {searchQueryRef.current
                    ? "No results found."
                    : "No options available."}
                </ComboboxEmpty>
                <ComboboxList
                  onScroll={handleListScroll}
                  children={
                    ((item: ComboboxAutoloadOption) => (
                      <ComboboxItem
                        key={item.value}
                        value={item}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </ComboboxItem>
                    )) as unknown as React.ReactNode
                  }
                />
                {isLoading && (
                  <div className="flex items-center justify-center py-2">
                    <Spinner className="size-4" />
                  </div>
                )}
                {!isLoading && hasMore && options.length > 0 && (
                  <div className="flex items-center justify-center py-1">
                    <span className="text-xs text-muted-foreground">
                      Scroll for more...
                    </span>
                  </div>
                )}
              </ComboboxContent>
            </Combobox>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )
      }}
    />
  )
}
