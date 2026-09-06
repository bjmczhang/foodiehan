import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Your checkout",
  description: "Start with something you love.",
}
export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[65vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4">One step at a time</p>
      <h1 className="page-title">Something good starts here.</h1>
      <p className="page-description mt-5 max-w-lg">
        Your checkout is not ready yet. Add your favourites to the cart, then
        come back to finish your order.
      </p>
      <LocalizedClientLink href="/store" className="button-primary mt-8">
        Explore the shop
      </LocalizedClientLink>
      <LocalizedClientLink href="/cart" className="text-link mt-5 text-sm">
        Back to cart
      </LocalizedClientLink>
    </div>
  )
}
