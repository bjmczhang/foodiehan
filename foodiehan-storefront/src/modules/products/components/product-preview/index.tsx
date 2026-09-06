import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
export default function ProductPreview({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region?: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <article data-testid="product-wrapper">
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            alt={product.title || "FoodieHan product"}
            size="full"
            isFeatured={isFeatured}
          />
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#323c2b] transition-colors group-hover:bg-[#323c2b] group-hover:text-white"
          >
            ↗
          </span>
          {cheapestPrice?.price_type === "sale" && (
            <span className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-xs">
              Special price
            </span>
          )}
        </div>
        <div className="pt-4">
          {product.collection?.title && (
            <p className="uppercase tracking-[0.12em] text-[10px] text-[#73766c] mb-1.5">
              {product.collection.title}
            </p>
          )}
          <h3
            className="text-[15px] md:text-base font-medium leading-snug text-[#272b24] group-hover:text-[#5c674e]"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
            {(product.variants?.length || 0) > 1 && cheapestPrice && (
              <span className="text-[#73766c]">From</span>
            )}
            {cheapestPrice ? (
              <PreviewPrice price={cheapestPrice} />
            ) : (
              <span className="text-[#73766c]">View product</span>
            )}
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
