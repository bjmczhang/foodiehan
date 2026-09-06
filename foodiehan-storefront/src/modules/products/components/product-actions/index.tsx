"use client"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "./option-select"
import ProductPrice from "../product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { isEqual } from "lodash"
import {
  useParams,
  usePathname,
  useSearchParams,
  useRouter,
} from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}
const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) =>
  variantOptions?.reduce((acc: Record<string, string>, option) => {
    if (option.option_id) acc[option.option_id] = option.value
    return acc
  }, {}) || {}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string
  const requestedVariant = searchParams.get("v_id")
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    () => {
      const variant =
        product.variants?.find((item) => item.id === requestedVariant) ||
        (product.variants?.length === 1 ? product.variants[0] : undefined)
      return variant ? optionsAsKeymap(variant.options) : {}
    }
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)
  const selectedVariant = useMemo(
    () =>
      product.variants?.find((variant) =>
        isEqual(optionsAsKeymap(variant.options), options)
      ),
    [product.variants, options]
  )
  useEffect(() => {
    const variant = product.variants?.find(
      (item) => item.id === requestedVariant
    )
    if (variant) setOptions(optionsAsKeymap(variant.options))
  }, [requestedVariant, product.variants])
  useEffect(() => {
    setQuantity(1)
    setAdded(false)
    setError("")
  }, [selectedVariant?.id])
  const inStock =
    !!selectedVariant &&
    (!selectedVariant.manage_inventory ||
      selectedVariant.allow_backorder ||
      (selectedVariant.inventory_quantity || 0) > 0)
  const maxQuantity =
    selectedVariant?.manage_inventory && !selectedVariant.allow_backorder
      ? Math.max(0, selectedVariant.inventory_quantity || 0)
      : 99
  const setOptionValue = (optionId: string, value: string) => {
    const nextOptions = { ...options, [optionId]: value }
    setOptions(nextOptions)
    setAdded(false)
    setError("")
    const variant = product.variants?.find((item) =>
      isEqual(optionsAsKeymap(item.options), nextOptions)
    )
    const params = new URLSearchParams(searchParams)
    if (variant) params.set("v_id", variant.id)
    else params.delete("v_id")
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, {
      scroll: false,
    })
  }
  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !inStock || isAdding || disabled) return
    setIsAdding(true)
    setError("")
    setAdded(false)
    try {
      await addToCart({ variantId: selectedVariant.id, quantity, countryCode })
      setAdded(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "We couldn’t add this item. Please try again."
      )
    } finally {
      setIsAdding(false)
    }
  }
  return (
    <div className="surface-panel" data-testid="product-actions">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <ProductPrice product={product} variant={selectedVariant} />
        {selectedVariant && (
          <span
            className={`text-xs rounded-full px-3 py-1.5 ${
              inStock
                ? "bg-[#edf0e8] text-[#323c2b]"
                : "bg-[#f3ede7] text-[#87654b]"
            }`}
          >
            {inStock ? "Available to order" : "Sold out"}
          </span>
        )}
      </div>
      {(product.variants?.length || 0) > 1 &&
        (product.options || []).map((option) => (
          <OptionSelect
            key={option.id}
            option={option}
            current={options[option.id]}
            updateOption={setOptionValue}
            title={option.title || "Option"}
            data-testid="product-options"
            disabled={!!disabled || isAdding}
          />
        ))}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex h-12 items-center border border-[#e2e4dc] rounded-full self-start shrink-0">
          <button
            aria-label="Decrease quantity"
            type="button"
            onClick={() => {
              setQuantity((current) => Math.max(1, current - 1))
              setAdded(false)
            }}
            disabled={quantity <= 1 || isAdding || disabled}
            className="w-11 h-full disabled:opacity-30"
          >
            −
          </button>
          <output aria-label="Quantity" className="min-w-8 text-center text-sm">
            {quantity}
          </output>
          <button
            aria-label="Increase quantity"
            type="button"
            onClick={() => {
              setQuantity((current) => Math.min(maxQuantity, current + 1))
              setAdded(false)
            }}
            disabled={
              !inStock || quantity >= maxQuantity || isAdding || disabled
            }
            className="w-11 h-full disabled:opacity-30"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || isAdding}
          className="button-primary flex-1 min-h-12 disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="add-product-button"
        >
          {isAdding
            ? "Adding to your bag…"
            : !selectedVariant
            ? "Choose your options"
            : !inStock
            ? "Out of stock"
            : "Add to bag"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700 mt-4">
          {error}
        </p>
      )}
      {added && (
        <p role="status" className="text-sm text-[#323c2b] mt-4">
          Added to your bag.{" "}
          <LocalizedClientLink
            href="/cart"
            className="underline underline-offset-4 font-medium"
          >
            View bag →
          </LocalizedClientLink>
        </p>
      )}
    </div>
  )
}
