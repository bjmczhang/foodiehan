import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { sanitizeImageUrl } from "@lib/util/sanitize-image-url"
import { getProductPrice } from "@lib/util/get-product-price"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Query products for the "You may also like" section
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 8,
    is_giftcard: false,
  }
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  let products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  // If no related products by collection, fallback to general products
  if (products.length < 4) {
    const fallbackProducts = await listProducts({
      queryParams: { limit: 6, is_giftcard: false },
      countryCode,
    }).then(({ response }) => {
      return response.products.filter((p) => p.id !== product.id)
    })
    products = Array.from(
      new Map([...products, ...fallbackProducts].map((p) => [p.id, p])).values()
    )
  }

  const displayProducts = products.slice(0, 4)

  if (!displayProducts.length) {
    return null
  }

  return (
    <div className="w-full pt-16 sm:pt-24 pb-16">
      <h2
        className="text-2xl sm:text-3xl font-normal text-center tracking-wide text-[#1a1a1a] mb-12 sm:mb-16"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        You may also like
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
        {displayProducts.map((p) => {
          const thumbnail = sanitizeImageUrl(p.thumbnail || p.images?.[0]?.url)
          const { cheapestPrice } = getProductPrice({ product: p })

          return (
            <LocalizedClientLink
              key={p.id}
              href={`/products/${p.handle}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-white flex items-center justify-center overflow-hidden mb-3 p-4">
                {thumbnail ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={thumbnail}
                      alt={p.title ?? ""}
                      fill
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#f9f9f9] flex items-center justify-center">
                    <span className="text-xs text-neutral-400">No image</span>
                  </div>
                )}
              </div>

              {/* Product Title */}
              <h3 className="text-sm font-normal text-[#1a1a1a] mb-1 group-hover:text-[#666] transition-colors">
                {p.title}
              </h3>

              {/* Price */}
              {cheapestPrice && (
                <p className="text-xs text-[#666666] font-light">
                  <span className="font-light">From </span>
                  <span className="text-[#1a1a1a] font-normal">
                    {cheapestPrice.calculated_price}
                  </span>
                </p>
              )}
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}
