import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}
export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div id="product-info">
      {product.collection ? (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="eyebrow mb-4 inline-block"
        >
          {product.collection.title}
        </LocalizedClientLink>
      ) : (
        <p className="eyebrow mb-4">From the FoodieHan kitchen</p>
      )}
      <h1
        className="font-serif text-[38px] md:text-5xl leading-[1.08] tracking-[-0.035em] text-[#272b24] mb-5"
        data-testid="product-title"
      >
        {product.title}
      </h1>
      {product.subtitle && (
        <p className="text-lg text-[#73766c] mb-4">{product.subtitle}</p>
      )}
      {product.description && (
        <p
          className="text-[15px] leading-7 text-[#73766c] whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}
