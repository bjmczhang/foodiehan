import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

const OrderCard = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const items = order.items || []
  const quantity = items.reduce((count, item) => count + item.quantity, 0)
  const status =
    order.status === "canceled"
      ? "Canceled"
      : order.fulfillment_status?.replaceAll("_", " ") || "Processing"
  return (
    <article
      className="overflow-hidden rounded-2xl border border-[#e2e4dc] bg-white"
      data-testid="order-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e4dc] bg-[#fcfcf9] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-semibold">
            Order #
            <span data-testid="order-display-id">{order.display_id}</span>
          </h2>
          <p
            className="mt-1 text-xs text-[#73766c]"
            data-testid="order-created-at"
          >
            Placed{" "}
            {new Date(order.created_at).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className="rounded-full bg-[#edf0e5] px-3 py-1.5 text-xs capitalize text-[#46523b]"
          data-testid="order-status"
        >
          {status}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex min-w-0 items-center gap-3"
              data-testid="order-item"
            >
              <div className="w-16 shrink-0">
                <Thumbnail
                  thumbnail={item.thumbnail}
                  images={[]}
                  size="square"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="line-clamp-2 text-sm font-medium"
                  data-testid="item-title"
                >
                  {item.product_title || item.title}
                </p>
                <p className="mt-1 text-xs text-[#73766c]">
                  Qty <span data-testid="item-quantity">{item.quantity}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        {items.length > 4 && (
          <p className="mt-4 text-xs text-[#73766c]">
            + {items.length - 4} more{" "}
            {items.length - 4 === 1 ? "product" : "products"}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e2e4dc] pt-5">
          <div className="text-sm">
            <span className="font-semibold" data-testid="order-amount">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
            <span className="ml-2 text-xs text-[#73766c]">
              / {quantity} {quantity === 1 ? "item" : "items"}
            </span>
          </div>
          <LocalizedClientLink
            href={`/account/orders/details/${order.id}`}
            className="button-secondary !px-5 !py-2.5 !text-xs"
            data-testid="order-details-link"
          >
            View order <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>
      </div>
    </article>
  )
}
export default OrderCard
