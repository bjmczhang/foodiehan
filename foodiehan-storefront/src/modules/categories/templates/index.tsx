import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  q,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  q?: string
}) {
  if (!category || !countryCode) notFound()
  return (
    <StoreTemplate
      kind="category"
      title={category.name}
      description={
        category.description ||
        `Explore our ${category.name.toLowerCase()} collection and find your next favourite.`
      }
      categoryId={category.id}
      categoryChildren={category.category_children || []}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      q={q}
    />
  )
}
