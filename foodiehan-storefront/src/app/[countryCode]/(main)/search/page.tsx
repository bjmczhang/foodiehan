import { Metadata } from "next"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Search | FoodieHan",
  description:
    "Find your favourite FoodieHan buns, bakes and Korean-inspired flavours.",
  robots: { index: false },
}
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ q?: string; sortBy?: SortOptions; page?: string }>
}) {
  const [{ countryCode }, query] = await Promise.all([params, searchParams])
  return (
    <StoreTemplate
      countryCode={countryCode}
      q={query.q}
      sortBy={query.sortBy}
      page={query.page}
      kind="search"
    />
  )
}
