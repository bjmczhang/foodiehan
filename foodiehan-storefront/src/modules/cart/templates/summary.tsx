import { HttpTypes } from "@medusajs/types"
import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart.shipping_address?.address_1 || !cart.email) return "address"
  if (!cart.shipping_methods?.length) return "delivery"
  return "payment"
}
const Summary = ({ cart }: { cart: HttpTypes.StoreCart }) => (
  <div className="flex flex-col gap-6">
    <h2 className="font-serif text-[28px] font-normal tracking-tight">
      Order summary
    </h2>
    <CartTotals totals={cart} />
    <p className="text-xs leading-5 text-[#73766c]">
      Delivery options and any additional charges are confirmed at checkout.
    </p>
    <div className="border-t border-[#e2e4dc] pt-5">
      <DiscountCode cart={cart} />
    </div>
    <LocalizedClientLink
      href={"/checkout?step=" + getCheckoutStep(cart)}
      className="button-primary w-full justify-center"
      data-testid="checkout-button"
    >
      Continue to checkout <span aria-hidden="true">→</span>
    </LocalizedClientLink>
    <div className="flex items-center justify-center gap-2 text-xs text-[#73766c]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V6a4 4 0 0 1 8 0v4" />
      </svg>
      Secure checkout
    </div>
  </div>
)
export default Summary
