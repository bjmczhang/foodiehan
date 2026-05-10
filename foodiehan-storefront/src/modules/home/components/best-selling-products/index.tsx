import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductTabs from "./product-tabs"

export default async function BestSellingProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
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
        order: "-created_at",
      },
    }),
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 8,
        fields: "*variants.calculated_price",
        order: "-created_at",
      },
    }),
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 8,
        fields: "*variants.calculated_price",
        order: "-created_at",
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
