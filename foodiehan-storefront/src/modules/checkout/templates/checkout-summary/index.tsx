import { HttpTypes } from "@medusajs/types"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => (
  <aside className="surface-panel min-w-0 large:sticky large:top-8">
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-serif text-[28px] tracking-tight">Your order</h2>
      <LocalizedClientLink href="/cart" className="text-link text-xs">
        Edit cart
      </LocalizedClientLink>
    </div>
    <ItemsPreviewTemplate cart={cart} />
    <div className="border-t border-[#e2e4dc] py-5">
      <DiscountCode cart={cart} />
    </div>
    <div className="border-t border-[#e2e4dc] pt-6">
      <CartTotals totals={cart} />
    </div>
    <div className="mt-6 rounded-xl bg-[#f8f7f3] p-4 text-xs leading-6 text-[#73766c]">
      Something to ask before you order?{" "}
      <LocalizedClientLink href="/contact" className="text-link">
        We are here to help.
      </LocalizedClientLink>
    </div>
  </aside>
)
export default CheckoutSummary
