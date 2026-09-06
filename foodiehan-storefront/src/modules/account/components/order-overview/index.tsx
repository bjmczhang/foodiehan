import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Package from "@modules/common/icons/package"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length)
    return (
      <div className="flex w-full flex-col gap-5">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    )
  return (
    <div
      className="surface-panel flex w-full flex-col items-center !py-14 text-center"
      data-testid="no-orders-container"
    >
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf0e5]">
        <Package size={28} />
      </span>
      <p className="eyebrow mb-3">Something good starts here</p>
      <h2 className="font-serif text-3xl">Your first order is waiting.</h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#73766c]">
        You haven’t placed an order yet. Explore the collection and find a
        little something for your everyday.
      </p>
      <LocalizedClientLink
        href="/store"
        className="button-primary mt-7"
        data-testid="continue-shopping-button"
      >
        Explore the shop <span aria-hidden="true">↗</span>
      </LocalizedClientLink>
    </div>
  )
}
export default OrderOverview
