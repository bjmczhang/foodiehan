import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })
  const price = variant ? variantPrice : cheapestPrice
  if (!price) return <p className="text-sm text-[#73766c]">Price unavailable</p>
  return (
    <div className="flex flex-wrap items-baseline gap-2 text-[#272b24]">
      {!variant && (product.variants?.length || 0) > 1 && (
        <span className="text-sm text-[#73766c]">From</span>
      )}
      <span
        className="text-2xl font-medium"
        data-testid="product-price"
        data-value={price.calculated_price_number}
      >
        {price.calculated_price}
      </span>
      {price.price_type === "sale" && (
        <span
          className="line-through text-sm text-[#73766c]"
          data-testid="original-product-price"
          data-value={price.original_price_number}
        >
          {price.original_price}
        </span>
      )}
    </div>
  )
}
