import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
export const metadata: Metadata = {
  title: "Shop",
  description:
    "Explore the FoodieHan bakery and pantry. Find your favourites, choose your options, and order online.",
}
type Props = {
  searchParams: Promise<{ sortBy?: SortOptions; page?: string; q?: string }>
  params: Promise<{ countryCode: string }>
}
export default async function StorePage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { sortBy, page, q } = await searchParams
  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      q={q}
      countryCode={countryCode}
    />
  )
}
