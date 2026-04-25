import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import OrderProductCard from "@modules/store/components/order-product-card"

export default async function BestSellingProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
      order: "-created_at",
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <div className="py-12 content-container small:py-24">
      <div className="flex items-center justify-between mb-8">
        <Text className="font-semibold txt-xlarge">Best Selling Products</Text>
        <InteractiveLink href="/store">View all</InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 small:gap-y-12">
        {products.slice(0, 8).map((product) => (
          <li key={product.id}>
            <OrderProductCard product={product} regionId={region.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
