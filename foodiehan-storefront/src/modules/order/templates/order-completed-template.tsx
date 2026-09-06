import { HttpTypes } from "@medusajs/types"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function OrderCompletedTemplate({
  order,
}: {
  order: HttpTypes.StoreOrder
}) {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl" data-testid="order-complete-container">
        <div className="mb-10 flex flex-col items-center text-center">
          <span
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8eddf] text-2xl text-[#46523b]"
            aria-hidden="true"
          >
            ✓
          </span>
          <p className="eyebrow mb-4">A little something to look forward to</p>
          <h1 className="page-title">Thank you for your order.</h1>
          <p className="page-description mt-5 max-w-lg">
            Good things are on their way. Your order has been placed, and you’ll
            find all the details below.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <LocalizedClientLink href="/store" className="button-primary">
              Keep exploring <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account/orders"
              className="button-secondary"
            >
              My orders
            </LocalizedClientLink>
          </div>
        </div>
        <div className="grid gap-5">
          <OrderDetails order={order} showStatus />
          <div className="grid items-start gap-5 small:grid-cols-[minmax(0,1fr)_310px]">
            <div className="grid gap-5">
              <section className="surface-panel">
                <h2 className="mb-5 font-serif text-2xl">
                  Your new favourites.
                </h2>
                <Items order={order} />
              </section>
              <ShippingDetails order={order} />
              <PaymentDetails order={order} />
            </div>
            <div className="grid gap-5 small:sticky small:top-28">
              <OrderSummary order={order} />
              <Help />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
