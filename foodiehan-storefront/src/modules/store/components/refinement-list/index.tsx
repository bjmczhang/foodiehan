"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  q?: string
  "data-testid"?: string
}

export default function RefinementList({
  sortBy,
  search = false,
  q = "",
  "data-testid": dataTestId,
}: RefinementListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const setQueryParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value.trim()) params.set(name, value.trim())
    else params.delete(name)
    params.delete("page")
    router.push(`${pathname}${params.size ? `?${params.toString()}` : ""}`)
  }
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {search && (
        <form
          role="search"
          className="w-full sm:max-w-md"
          onSubmit={(event) => {
            event.preventDefault()
            setQueryParams(
              "q",
              String(new FormData(event.currentTarget).get("q") || "")
            )
          }}
        >
          <label htmlFor="catalog-search" className="sr-only">
            Search products
          </label>
          <div className="flex items-center bg-white border border-[#e2e4dc] rounded-full px-4 focus-within:border-[#323c2b]">
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              key={q}
              id="catalog-search"
              name="q"
              defaultValue={q}
              type="search"
              placeholder="Search for something delicious"
              className="min-w-0 w-full border-0 bg-transparent px-3 py-3.5 text-sm outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="text-xs font-medium py-2 text-[#323c2b] hover:underline"
            >
              Search
            </button>
          </div>
        </form>
      )}
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}
