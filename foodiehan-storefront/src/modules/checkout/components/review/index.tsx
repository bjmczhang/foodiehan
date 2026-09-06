"use client"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Review = ({ cart }: { cart: any }) => {
  const isOpen = useSearchParams().get("step") === "review"
  const paidByGiftcard = cart?.gift_cards?.length > 0 && cart?.total === 0
  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods?.length > 0 &&
    (cart.payment_collection || paidByGiftcard)
  return (
    <section className="surface-panel">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[#73766c]">04</span>
        <h2
          className={
            "font-serif text-[26px] font-normal tracking-tight " +
            (!isOpen ? "text-[#73766c]" : "")
          }
        >
          One last look
        </h2>
      </div>
      {isOpen && previousStepsCompleted ? (
        <div className="mt-6">
          <p className="mb-5 text-sm leading-7 text-[#73766c]">
            Check your items, delivery address and payment details. Once
            everything looks right, place your order and we will send a
            confirmation to{" "}
            <span className="break-all text-[#272b24]">{cart.email}</span>.
          </p>
          <div className="mb-6 rounded-xl bg-[#f8f7f3] p-4 text-xs leading-6 text-[#73766c]">
            Need to make a change? Use the edit links above. For questions about
            your order,{" "}
            <LocalizedClientLink href="/contact" className="text-link">
              contact us
            </LocalizedClientLink>
            .
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#73766c]">
          Complete your details, delivery and payment to place your order.
        </p>
      )}
    </section>
  )
}
export default Review
