"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useParams } from "next/navigation"

type MenuProductCardProps = {
  product: HttpTypes.StoreProduct
}

function formatPrice(product: HttpTypes.StoreProduct): string | null {
  const variant = product.variants?.[0] as any
  const amount = variant?.calculated_price?.calculated_amount
  if (amount == null) return null

  // Check if any variant is sold out
  const variants = product.variants ?? []
  const inStock = variants.some((v: any) => {
    if (v.manage_inventory === false) return true
    return (v.inventory_quantity ?? 1) > 0
  })
  if (!inStock) return "Sold out"

  const code = variant.calculated_price.currency_code?.toUpperCase() ?? "AUD"
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: code,
  }).format(amount / 100)
}

export default function MenuProductCard({ product }: MenuProductCardProps) {
  const { countryCode } = useParams()

  const price = formatPrice(product)

  return (
    <div className="flex flex-col group">
      {/* ── Image ── */}
      <a
        href={`/${countryCode}/products/${product.handle}`}
        className="block overflow-hidden mb-3"
        style={{ aspectRatio: "1 / 1" }}
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title ?? ""}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "#f5f5f5" }}
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

      {/* ── Product name ── */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          lineHeight: 1.4,
          margin: 0,
        }}
      >
        <a
          href={`/${countryCode}/products/${product.handle}`}
          className="hover:text-[var(--color-brand)] transition-colors duration-150"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {product.title}
        </a>
      </h3>

      {/* ── Price ── */}
      {price && (
        <p
          style={{
            fontSize: 13,
            color: price === "Sold out" ? "#999999" : "#666666",
            marginTop: 4,
            margin: 0,
          }}
        >
          {price === "Sold out" ? "Sold out" : price}
        </p>
      )}
    </div>
  )
}
