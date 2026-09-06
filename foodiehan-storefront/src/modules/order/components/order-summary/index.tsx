import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

const OrderSummary = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const amount = (value?: number | null) =>
    convertToLocale({ amount: value ?? 0, currency_code: order.currency_code })
  return (
    <section className="surface-panel">
      <h2 className="mb-6 font-serif text-2xl">Order summary.</h2>
      <dl className="grid gap-4 text-sm text-[#73766c]">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd className="text-[#272b24]">{amount(order.subtotal)}</dd>
        </div>
        {order.discount_total > 0 && (
          <div className="flex justify-between gap-4">
            <dt>Discount</dt>
            <dd className="text-[#46523b]">− {amount(order.discount_total)}</dd>
          </div>
        )}
        {order.gift_card_total > 0 && (
          <div className="flex justify-between gap-4">
            <dt>Gift card</dt>
            <dd className="text-[#46523b]">
              − {amount(order.gift_card_total)}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>Delivery</dt>
          <dd className="text-[#272b24]">{amount(order.shipping_total)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Taxes</dt>
          <dd className="text-[#272b24]">{amount(order.tax_total)}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-4 border-t border-[#e2e4dc] pt-5 text-base font-semibold text-[#272b24]">
          <dt>
            Total{" "}
            <span className="text-[10px] font-normal uppercase text-[#73766c]">
              {order.currency_code}
            </span>
          </dt>
          <dd>{amount(order.total)}</dd>
        </div>
      </dl>
    </section>
  )
}
export default OrderSummary
