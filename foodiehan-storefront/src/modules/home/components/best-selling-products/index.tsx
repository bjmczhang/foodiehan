import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductTabs from "./product-tabs"

export default async function BestSellingProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  // Look up collections by handle to differentiate the three tabs.
  // Falls back to sort-order differentiation when collections aren't set up.
  const { collections } = await listCollections()

  const bestSellersCollection = collections.find(
    (c) => c.handle === "best-sellers"
  )
  const newArrivalsCollection = collections.find(
    (c) => c.handle === "new-arrivals"
  )
  const hotItemsCollection = collections.find(
    (c) => c.handle === "hot-items"
  )

  const [
    { response: { products: bestSellers } },
    { response: { products: newArrivals } },
    { response: { products: hotItems } },
  ] = await Promise.all([
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 8,
        fields: "*variants.calculated_price",
        ...(bestSellersCollection
          ? { collection_id: bestSellersCollection.id }
          : { order: "-created_at" }),
      },
    }),
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 8,
        fields: "*variants.calculated_price",
        ...(newArrivalsCollection
          ? { collection_id: newArrivalsCollection.id }
          : { order: "-updated_at" }),
      },
    }),
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 8,
        fields: "*variants.calculated_price",
        ...(hotItemsCollection
          ? { collection_id: hotItemsCollection.id }
          : { order: "title" }),
      },
    }),
  ])

  if (!bestSellers?.length && !newArrivals?.length && !hotItems?.length) {
    return null
  }

  return (
    <ProductTabs
      bestSellers={bestSellers || []}
      newArrivals={newArrivals || []}
      hotItems={hotItems || []}
      regionId={region.id}
    />
  )
}
