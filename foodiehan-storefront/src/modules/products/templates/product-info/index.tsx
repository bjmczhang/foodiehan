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
    <div id="product-info" className="flex flex-col gap-y-5">
      {/* Product title */}
      <h1
        className="text-3xl font-light tracking-wide small:text-4xl"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "var(--color-text-primary)",
        }}
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {/* Price */}
      {selectedPrice && (
        <p
          className="text-lg font-normal"
          style={{ color: "var(--color-text-primary)" }}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && "From "}
          {selectedPrice.calculated_price}
        </p>
      )}

      {/* Description */}
      {product.description && (
        <p
          className="text-sm leading-relaxed whitespace-pre-line"
          style={{
            color: "var(--color-text-secondary)",
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
