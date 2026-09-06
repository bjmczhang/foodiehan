import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"

const OrderDetailsTemplate = ({ order }: { order: HttpTypes.StoreOrder }) => (
  <div className="flex flex-col gap-6">
    <LocalizedClientLink
      href="/account/orders"
      className="text-link w-fit text-sm"
      data-testid="back-to-overview-button"
    >
      <span aria-hidden="true">←</span> All orders
    </LocalizedClientLink>
    <div>
      <p className="eyebrow mb-3">Every detail, in one place</p>
      <h1 className="page-title">Your order.</h1>
    </div>
    <div
      className="flex w-full flex-col gap-5"
      data-testid="order-details-container"
    >
      <OrderDetails order={order} showStatus />
      <section className="surface-panel">
        <h2 className="mb-5 font-serif text-2xl">The good stuff.</h2>
        <Items order={order} />
      </section>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-5">
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
        </div>
        <OrderSummary order={order} />
      </div>
      <Help />
    </div>
  </div>
)
export default OrderDetailsTemplate
