"use client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default function CheckoutError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-5">A brief pause</p>
      <h1 className="page-title">Checkout needs a moment.</h1>
      <p className="page-description my-6">
        We couldn’t load your checkout. If you were completing payment, check
        your orders before trying again.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="button-primary">
          Try again
        </button>
        <LocalizedClientLink
          href="/account/orders"
          className="button-secondary"
        >
          Check my orders
        </LocalizedClientLink>
      </div>
    </div>
  )
}
