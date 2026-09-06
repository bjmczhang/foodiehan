"use client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default function StoreError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-5">A brief pause</p>
      <h1 className="page-title">Let’s try that again.</h1>
      <p className="page-description my-6">
        We couldn’t load this page just now. Please try again, or let us know if
        you need a hand.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="button-primary">
          Try again
        </button>
        <LocalizedClientLink href="/contact" className="button-secondary">
          Contact us
        </LocalizedClientLink>
      </div>
    </div>
  )
}
