"use client"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { ShoppingBag, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import DeleteButton from "@modules/common/components/delete-button"

export default function CartDropdown({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) {
  const [open, setOpen] = useState(false)
  const total =
    cartState?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const previous = useRef(total)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  useEffect(() => {
    if (previous.current !== total && !pathname.includes("/cart")) {
      setOpen(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setOpen(false), 5000)
    }
    previous.current = total
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [total, pathname])
  useEffect(() => setOpen(false), [pathname])
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false)
      }}
    >
      <LocalizedClientLink
        className="icon-button relative"
        href="/cart"
        aria-label={`Shopping bag, ${total} items`}
        data-testid="nav-cart-link"
      >
        <ShoppingBag className="w-5 h-5" />
        {total > 0 && (
          <span
            data-testid="nav-cart-count"
            className="absolute right-0 top-0 flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-[#323c2b] text-white text-[9px]"
          >
            {total}
          </span>
        )}
      </LocalizedClientLink>
      {open && (
        <section
          aria-label="Shopping bag preview"
          className="hidden small:block absolute right-0 top-full pt-4 w-[380px] z-50"
          data-testid="nav-cart-dropdown"
        >
          <div className="rounded-2xl border border-[#e2e4dc] bg-[#f8f7f3] shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">
                Your bag{" "}
                <span className="font-sans text-xs text-[#73766c]">
                  ({total})
                </span>
              </h2>
              <button
                className="icon-button"
                onClick={() => setOpen(false)}
                aria-label="Close bag preview"
              >
                <XMark className="w-4 h-4" />
              </button>
            </div>
            {cartState?.items?.length ? (
              <>
                <ul className="max-h-80 overflow-y-auto space-y-5">
                  {[...cartState.items]
                    .sort((a, b) =>
                      String(b.created_at).localeCompare(String(a.created_at))
                    )
                    .map((item) => (
                      <li
                        className="flex gap-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20 shrink-0"
                        >
                          <Thumbnail thumbnail={item.thumbnail} size="square" />
                        </LocalizedClientLink>
                        <div className="min-w-0 flex-1">
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            className="text-sm font-medium line-clamp-2"
                          >
                            {item.product_title || item.title}
                          </LocalizedClientLink>
                          <p className="mt-1 text-xs text-[#73766c]">
                            Qty {item.quantity} ·{" "}
                            {convertToLocale({
                              amount:
                                item.total ?? item.unit_price * item.quantity,
                              currency_code: cartState.currency_code,
                            })}
                          </p>
                          <DeleteButton id={item.id} className="mt-2 text-xs">
                            Remove
                          </DeleteButton>
                        </div>
                      </li>
                    ))}
                </ul>
                <div className="border-t border-[#e2e4dc] pt-5 mt-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal</span>
                    <span data-testid="cart-subtotal">
                      {convertToLocale({
                        amount: cartState.subtotal ?? 0,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-[#73766c] mb-5">
                    Delivery and discounts calculated at checkout.
                  </p>
                  <LocalizedClientLink
                    href="/cart"
                    className="button-primary w-full"
                    data-testid="go-to-cart-button"
                  >
                    View your bag <span aria-hidden="true">→</span>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="py-7 text-center">
                <ShoppingBag className="w-9 h-9 mx-auto mb-4 text-[#73766c]" />
                <p className="text-sm mb-2">
                  Your next favourite belongs here.
                </p>
                <p className="text-xs text-[#73766c] mb-6">
                  Your shopping bag is empty.
                </p>
                <LocalizedClientLink href="/store" className="button-primary">
                  Explore the shop
                </LocalizedClientLink>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
