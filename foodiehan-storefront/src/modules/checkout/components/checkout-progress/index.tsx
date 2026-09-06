"use client"
import { HttpTypes } from "@medusajs/types"
import { useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"

const steps = [
  { key: "address", label: "Your details" },
  { key: "delivery", label: "Delivery" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
]

export default function CheckoutProgress({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const current = Math.max(
    0,
    steps.findIndex((step) => step.key === searchParams.get("step"))
  )
  const hasAddress = !!(cart.shipping_address?.address_1 && cart.email)
  const hasDelivery = !!cart.shipping_methods?.length
  const hasPayment = !!cart.payment_collection?.payment_sessions?.some(
    (session) => session.status === "pending"
  )
  return (
    <nav aria-label="Checkout progress" className="mb-9">
      <ol className="grid grid-cols-4 gap-2 small:gap-4">
        {steps.map((step, index) => {
          const enabled =
            index === 0 ||
            (index === 1 && hasAddress) ||
            (index === 2 && hasAddress && hasDelivery) ||
            (index === 3 && hasAddress && hasDelivery && hasPayment)
          const content = (
            <>
              <span
                className={
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs " +
                  (index <= current
                    ? "border-[#323c2b] bg-[#323c2b] text-white"
                    : "border-[#d8dccf]")
                }
              >
                {index < current ? "✓" : index + 1}
              </span>
              <span>{step.label}</span>
            </>
          )
          const className =
            "flex flex-col gap-2 border-b-2 pb-4 text-xs small:flex-row small:items-center small:gap-3 small:text-sm " +
            (index <= current
              ? "border-[#323c2b] text-[#323c2b]"
              : "border-[#e2e4dc] text-[#73766c]")
          return (
            <li key={step.key}>
              {enabled ? (
                <Link
                  href={pathname + "?step=" + step.key}
                  scroll={false}
                  className={className}
                  aria-current={index === current ? "step" : undefined}
                >
                  {content}
                </Link>
              ) : (
                <span className={className} aria-disabled="true">
                  {content}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
