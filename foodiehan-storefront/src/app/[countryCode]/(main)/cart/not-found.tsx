import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Cart unavailable",
  description: "Let's get you back to your favourites.",
}
export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4">A small pause</p>
      <h1 className="page-title">We could not load your cart.</h1>
      <p className="page-description mt-5 max-w-lg">
        Please try again in a moment. If you still need a hand, our team is here
        to help.
      </p>
      <LocalizedClientLink href="/cart" className="button-primary mt-8">
        Try again
      </LocalizedClientLink>
      <LocalizedClientLink href="/contact" className="text-link mt-5 text-sm">
        Contact us
      </LocalizedClientLink>
    </div>
  )
}
