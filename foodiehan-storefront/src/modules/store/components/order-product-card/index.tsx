"use client"

import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

type OrderProductCardProps = {
  product: HttpTypes.StoreProduct & { category_label?: string }
  regionId: string
}

function getFirstVariantPrice(product: HttpTypes.StoreProduct): {
  calculated: string | null
  original: string | null
  isOnSale: boolean
  isSoldOut: boolean
} {
  const variants = product.variants ?? []
  const inStock = variants.some((v: any) => {
    if (v.manage_inventory === false) return true
    return (v.inventory_quantity ?? 1) > 0
  })

  const variant = variants[0] as any
  if (!variant?.calculated_price?.calculated_amount) {
    return { calculated: null, original: null, isOnSale: false, isSoldOut: !inStock }
  }
  const code = variant.calculated_price.currency_code?.toUpperCase() ?? "AUD"
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: code }).format(n / 100)
  const calc = variant.calculated_price.calculated_amount
  const orig = variant.calculated_price.original_amount
  return {
    calculated: fmt(calc),
    original: orig && orig !== calc ? fmt(orig) : null,
    isOnSale: orig !== null && orig > calc,
    isSoldOut: !inStock,
  }
}

/** Five-star display — static placeholder since we have no ratings data yet */
function StarRating({ count = 5, filled = 5 }: { count?: number; filled?: number }) {
  return (
    <div className="flex items-center gap-x-0.5" aria-label={`${filled} out of ${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={i < filled ? "var(--color-brand)" : "#cccccc"}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6 0.5l1.545 3.13 3.455.502-2.5 2.435.59 3.44L6 8.327 2.91 9.507l.59-3.44L1 3.632l3.455-.502L6 0.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function OrderProductCard({
  product,
  regionId,
}: OrderProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const { countryCode } = useParams()
  const router = useRouter()

  const price = getFirstVariantPrice(product)
  const firstVariantId = product.variants?.[0]?.id
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  const categoryLabel =
    (product as any).categories?.[0]?.name ??
    (product as any).category_label ??
    null

  async function handleAddToCart() {
    if (!firstVariantId || price.isSoldOut) return
    setIsAdding(true)
    try {
      await addToCart({
        variantId: firstVariantId,
        quantity: 1,
        countryCode: countryCode as string,
      })
      router.refresh()
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <article
      className="flex flex-col overflow-hidden bg-white group"
      style={{
        borderRadius: "var(--product-card-corner-radius, 0)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)")
      }
    >
      {/* ── Image area (1:1 square like ChaTime) ── */}
      <div className="relative overflow-hidden" style={{ paddingBottom: "100%", height: 0 }}>

        {/* Link wrapper fills the padded box */}
        <a
          href={`/${countryCode}/products/${product.handle}`}
          className="absolute inset-0 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title ?? ""}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#f0edea" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
              >
                <rect width="48" height="48" fill="#e5e5e5" />
                <path d="M14 34l8-10 6 7 4-5 6 8H14z" fill="#cccccc" />
                <circle cx="32" cy="18" r="4" fill="#cccccc" />
              </svg>
            </div>
          )}
        </a>

        {/* Badges — top left */}
        <div className="absolute flex flex-col gap-1 pointer-events-none top-3 left-3">
          {price.isSoldOut && (
            <span
              className="px-2 py-0.5 text-white rounded-full"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "#333333",
              }}
            >
              Sold out
            </span>
          )}
          {price.isOnSale && !price.isSoldOut && (
            <span
              className="px-2 py-0.5 text-white"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "#c0392b",
                borderRadius: 0,
              }}
            >
              Sale
            </span>
          )}
        </div>

        {/* Quick View button — top right, visible on hover */}
        <div className="absolute transition-opacity duration-200 opacity-0 top-3 right-3 group-hover:opacity-100">
          <a
            href={`/${countryCode}/products/${product.handle}`}
            className="flex items-center justify-center bg-white rounded-full shadow-md"
            style={{ width: 36, height: 36 }}
            aria-label={`Quick view ${product.title}`}
            title="Quick view"
          >
            <svg
              width="16"
              height="12"
              viewBox="0 0 512 512"
              fill="currentColor"
              style={{ color: "#333333" }}
              aria-hidden="true"
            >
              <path d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035c-4.332 5.936-4.332 13.987 0 19.923C7.818 272.215 116.8 419.164 255.997 419.164s248.174-146.95 252.748-153.201a13.998 13.998 0 000-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.252 31.915-114.864 129.395-217.617 129.395z" />
              <path d="M255.997 154.725c-55.842 0-101.275 45.433-101.275 101.275s45.433 101.275 101.275 101.275 101.275-45.433 101.275-101.275-45.433-101.275-101.275-101.275zm0 168.791c-37.23 0-67.516-30.287-67.516-67.516s30.287-67.516 67.516-67.516 67.516 30.287 67.516 67.516-30.287 67.516-67.516 67.516z" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Card content ── */}
      <div className="flex flex-col flex-1 p-4 gap-y-1.5">

        {/* Star rating */}
        <div className="flex items-center gap-x-1.5">
          <StarRating filled={5} />
          <span style={{ fontSize: 11, color: "#999999" }}>(5.0)</span>
        </div>

        {/* Product name */}
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--color-text-primary)",
            lineHeight: 1.35,
          }}
        >
          <a
            href={`/${countryCode}/products/${product.handle}`}
            className="hover:text-[var(--color-brand)] transition-colors duration-150"
          >
            {product.title}
          </a>
        </h3>

        {/* Category label */}
        {categoryLabel && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: "#8d8d8d",
            }}
          >
            {categoryLabel}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-baseline mt-1 gap-x-2">
          {price.calculated && (
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: price.isOnSale
                  ? "var(--color-brand)"
                  : "var(--color-text-primary)",
              }}
            >
              {price.calculated}
            </span>
          )}
          {price.original && (
            <span
              style={{
                fontSize: 13,
                textDecoration: "line-through",
                color: "#aaaaaa",
              }}
            >
              {price.original}
            </span>
          )}
          {!price.calculated && (
            <span style={{ fontSize: 14, color: "#aaaaaa" }}>—</span>
          )}
        </div>

        {/* CTA button — always visible, full width */}
        {price.isSoldOut ? (
          <button
            disabled
            className="w-full mt-2 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-full"
            style={{
              background: "#e5e5e5",
              color: "#999999",
              border: "none",
              cursor: "not-allowed",
              letterSpacing: "0.1em",
            }}
          >
            Sold Out
          </button>
        ) : hasMultipleVariants ? (
          <a
            href={`/${countryCode}/products/${product.handle}`}
            className="block w-full mt-2 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white transition-colors duration-200 rounded-full"
            style={{
              background: "var(--color-brand)",              letterSpacing: "0.1em",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--color-brand-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--color-brand)")
            }
          >
            Select Options
          </a>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !firstVariantId}
            className="w-full mt-2 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-brand)",
              border: "none",
              borderRadius: 0,
              letterSpacing: "0.1em",
              cursor: isAdding ? "wait" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isAdding)
                (e.currentTarget as HTMLElement).style.background = "var(--color-brand-hover)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = "var(--color-brand)"
            }}
          >
            {isAdding ? "Adding…" : "Add to Cart"}
          </button>
        )}
      </div>
    </article>
  )
}
