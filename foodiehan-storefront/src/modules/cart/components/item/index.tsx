"use client"
import { useState } from "react"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"

const Item = ({
  item,
  type = "full",
  currencyCode,
}: {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const preview = type === "preview"
  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)
    try {
      await updateLineItem({ lineId: item.id, quantity })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't update this item. Please try again."
      )
    } finally {
      setUpdating(false)
    }
  }
  return (
    <article
      className={
        "flex min-w-0 gap-4 " + (preview ? "py-5" : "py-6 small:gap-6")
      }
      data-testid="product-row"
      aria-busy={updating}
    >
      <LocalizedClientLink
        href={"/products/" + item.product_handle}
        className={
          "shrink-0 overflow-hidden rounded-xl " +
          (preview ? "w-16" : "w-20 small:w-28")
        }
        aria-label={"View " + item.product_title}
      >
        <Thumbnail
          thumbnail={item.thumbnail}
          images={item.variant?.product?.images}
          size="square"
        />
      </LocalizedClientLink>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <LocalizedClientLink
              href={"/products/" + item.product_handle}
              className={
                "block font-medium leading-6 hover:text-[#73766c] " +
                (preview ? "text-sm" : "text-base")
              }
              data-testid="product-title"
            >
              {item.product_title}
            </LocalizedClientLink>
            <div className="mt-1 text-xs text-[#73766c]">
              <LineItemOptions
                variant={item.variant}
                data-testid="product-variant"
              />
            </div>
          </div>
          <div className="shrink-0 text-sm">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
        {preview ? (
          <p className="mt-2 text-xs text-[#73766c]">
            Quantity: {item.quantity}
          </p>
        ) : (
          <>
            <div className="mt-2 flex items-center gap-1 text-xs text-[#73766c]">
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
              <span>each</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <CartItemSelect
                value={item.quantity}
                onChange={(event) => changeQuantity(Number(event.target.value))}
                disabled={updating}
                aria-label={"Quantity for " + item.product_title}
                data-testid="product-select-button"
              >
                {Array.from(
                  { length: Math.max(10, item.quantity) },
                  (_, index) => (
                    <option value={index + 1} key={index + 1}>
                      {index + 1}
                    </option>
                  )
                )}
              </CartItemSelect>
              <DeleteButton id={item.id} data-testid="product-delete-button">
                Remove
              </DeleteButton>
              {updating && <Spinner />}
            </div>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </>
        )}
      </div>
    </article>
  )
}
export default Item
