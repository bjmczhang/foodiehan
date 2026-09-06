"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
type OrderProductCardProps = {
  product: HttpTypes.StoreProduct & { category_label?: string }
  regionId: string
}
export default function OrderProductCard({ product }: OrderProductCardProps) {
  const { countryCode } = useParams()
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState("")
  const variant = product.variants?.[0]
  const multiple = (product.variants?.length || 0) > 1
  const inStock =
    !!variant &&
    (!variant.manage_inventory ||
      variant.allow_backorder ||
      (variant.inventory_quantity || 0) > 0)
  const add = async () => {
    if (!variant?.id || isAdding || !inStock) return
    setIsAdding(true)
    setAdded(false)
    setError("")
    try {
      await addToCart({
        variantId: variant.id,
        quantity: 1,
        countryCode: countryCode as string,
      })
      setAdded(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Couldn’t add this item. Please try again."
      )
    } finally {
      setIsAdding(false)
    }
  }
  return (
    <div>
      <ProductPreview product={product} />
      {multiple ? (
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="button-secondary w-full mt-4 text-sm"
        >
          Choose options
        </LocalizedClientLink>
      ) : (
        <button
          type="button"
          onClick={add}
          disabled={isAdding || !inStock}
          className="button-secondary w-full mt-4 text-sm disabled:opacity-40"
        >
          {isAdding ? "Adding…" : !inStock ? "Sold out" : "Add to bag"}
        </button>
      )}
      {added && (
        <p role="status" className="text-sm mt-3 text-[#323c2b]">
          Added.{" "}
          <LocalizedClientLink href="/cart" className="underline">
            View bag
          </LocalizedClientLink>
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs text-red-700 mt-3">
          {error}
        </p>
      )}
    </div>
  )
}
