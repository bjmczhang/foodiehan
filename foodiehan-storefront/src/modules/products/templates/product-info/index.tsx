import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}

const ProductInfo = ({ product, variant }: ProductInfoProps) => {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  return (
    <div id="product-info" className="flex flex-col">
      {/* Product title */}
      <h1
        className="text-3xl font-normal tracking-wide small:text-4xl text-[#1a1a1a] mb-3"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {/* Price */}
      {selectedPrice && (
        <div
          className="flex items-baseline gap-1 mb-6"
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && (
            <span className="text-sm font-light text-[#666666]">From </span>
          )}
          <span className="text-xl font-normal text-[#1a1a1a]">
            {selectedPrice.calculated_price}
          </span>
        </div>
      )}

      {/* Thin horizontal divider */}
      <div className="w-full border-b border-[#e8e8e8] mb-6" />

      {/* Description */}
      {product.description && (
        <p
          className="text-sm leading-relaxed text-[#4a4a4a] whitespace-pre-line mb-6 font-light"
          style={{
            lineHeight: "1.8",
          }}
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
