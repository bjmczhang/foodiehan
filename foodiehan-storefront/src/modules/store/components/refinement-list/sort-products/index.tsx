"use client"
export type SortOptions = "price_asc" | "price_desc" | "created_at"
type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}
export default function SortProducts({
  sortBy,
  setQueryParams,
  "data-testid": dataTestId,
}: SortProductsProps) {
  return (
    <div className="flex items-center gap-3 shrink-0" data-testid={dataTestId}>
      <label htmlFor="catalog-sort" className="text-sm text-[#73766c]">
        Sort by
      </label>
      <select
        id="catalog-sort"
        value={sortBy}
        onChange={(event) =>
          setQueryParams("sortBy", event.target.value as SortOptions)
        }
        className="rounded-full border border-[#e2e4dc] bg-white text-sm py-3 pl-4 pr-9 cursor-pointer focus:border-[#323c2b] focus:ring-[#323c2b]"
      >
        <option value="created_at">Newest arrivals</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
      </select>
    </div>
  )
}
