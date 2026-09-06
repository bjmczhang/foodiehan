import { HttpTypes } from "@medusajs/types"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
export default function CollectionTemplate({
  collection,
  sortBy,
  page,
  countryCode,
  q,
}: {
  collection: HttpTypes.StoreCollection
  sortBy?: SortOptions
  page?: string
  countryCode: string
  q?: string
}) {
  return (
    <StoreTemplate
      kind="collection"
      title={collection.title}
      description={`Discover the ${collection.title.toLowerCase()} collection from FoodieHan.`}
      collectionId={collection.id}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      q={q}
    />
  )
}
