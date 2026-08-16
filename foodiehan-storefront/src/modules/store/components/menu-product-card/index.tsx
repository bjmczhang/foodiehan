"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useParams } from "next/navigation"
import { sanitizeImageUrl } from "@lib/util/sanitize-image-url"

type MenuProductCardProps = {
  product: HttpTypes.StoreProduct
}

function formatPrice(
  product: HttpTypes.StoreProduct
): { text: string; isSoldOut: boolean } | null {
  const variant = product.variants?.[0] as any
  const amount = variant?.calculated_price?.calculated_amount
  if (amount == null) return null

  // Check if any variant is in stock
  const variants = product.variants ?? []
  const inStock = variants.some((v: any) => {
    if (v.manage_inventory === false) return true
    return (v.inventory_quantity ?? 1) > 0
  })
  if (!inStock) return { text: "Sold out", isSoldOut: true }

  const code = variant.calculated_price.currency_code?.toUpperCase() ?? "AUD"
  const formatted = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: code,
  }).format(amount / 100)

  return { text: formatted, isSoldOut: false }
}

export default function MenuProductCard({ product }: MenuProductCardProps) {
  const { countryCode } = useParams()
  const priceData = formatPrice(product)
  const thumbnail = sanitizeImageUrl(product.thumbnail)

  return (
    <div className="group flex flex-col items-center text-center">
      {/* Product Image Container */}
      <a
        href={`/${countryCode}/products/${product.handle}`}
        className="w-full aspect-square flex items-center justify-center bg-white overflow-hidden mb-3 p-3 sm:p-5 transition-all duration-300"
      >
        {thumbnail ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={thumbnail}
              alt={product.title ?? ""}
              width={480}
              height={480}
              className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f9f9f9] rounded-sm">
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
              className="text-[#d0d0d0]"
            >
              <rect
                width="48"
                height="48"
                fill="currentColor"
                fillOpacity="0.3"
              />
              <path d="M14 34l8-10 6 7 4-5 6 8H14z" fill="currentColor" />
              <circle cx="32" cy="18" r="4" fill="currentColor" />
            </svg>
          </div>
        )}
      </a>

      {/* Product Title */}
      <h3 className="text-xs sm:text-[13px] font-normal tracking-wide text-[#222222] mb-1 leading-snug">
        <a
          href={`/${countryCode}/products/${product.handle}`}
          className="transition-colors duration-200 hover:text-[var(--color-brand)]"
        >
          {product.title}
        </a>
      </h3>

      {/* Price */}
      {priceData && (
        <p className="text-[11px] sm:text-xs tracking-normal">
          {priceData.isSoldOut ? (
            <span className="text-[#999999]">Sold out</span>
          ) : (
            <>
              <span className="text-[#888888] font-light">From </span>
              <span className="text-[#222222] font-normal">
                {priceData.text}
              </span>
            </>
          )}
        </p>
      )}
    </div>
  )
}

