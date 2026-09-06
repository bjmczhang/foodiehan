import { HttpTypes } from "@medusajs/types"

const formatStatus = (value: string) =>
  value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase())

const OrderDetails = ({
  order,
  showStatus,
}: {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}) => {
  const steps = ["Order placed", "Preparing", "Shipped", "Delivered"]
  const fulfillment = order.fulfillment_status
  const step =
    fulfillment === "delivered"
      ? 3
      : ["shipped", "partially_shipped", "partially_delivered"].includes(
          fulfillment
        )
      ? 2
      : ["fulfilled", "partially_fulfilled"].includes(fulfillment)
      ? 1
      : 0
  const canceled = order.status === "canceled" || fulfillment === "canceled"
  return (
    <section className="surface-panel">
      <div className="flex flex-wrap justify-between gap-5">
        <div>
          <p className="text-xs text-[#73766c]">Order number</p>
          <h2 className="mt-1 text-xl font-semibold">
            #<span data-testid="order-id">{order.display_id}</span>
          </h2>
        </div>
        <div>
          <p className="text-xs text-[#73766c]">Placed on</p>
          <p className="mt-2 text-sm" data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {showStatus && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full bg-[#edf0e5] px-3 py-1.5 text-xs text-[#46523b]"
              data-testid="order-status"
            >
              {canceled ? "Canceled" : formatStatus(fulfillment)}
            </span>
            <span
              className="rounded-full border border-[#e2e4dc] px-3 py-1.5 text-xs text-[#73766c]"
              data-testid="order-payment-status"
            >
              {formatStatus(order.payment_status)}
            </span>
          </div>
        )}
      </div>
      <p className="mt-5 break-words text-sm leading-6 text-[#73766c]">
        Order confirmation details are sent to{" "}
        <span className="font-medium text-[#272b24]" data-testid="order-email">
          {order.email}
        </span>
        .
      </p>
      {!canceled && showStatus && (
        <ol
          aria-label="Delivery progress"
          className="mt-6 grid grid-cols-4 border-t border-[#e2e4dc] pt-6"
        >
          {steps.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={`relative flex flex-col items-center gap-3 px-1 text-center ${
                index <= step ? "text-[#46523b]" : "text-[#858a7d]"
              }`}
            >
              <span
                className={`z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  index <= step
                    ? "bg-[#323c2b] text-white"
                    : "border border-[#d9ddcf] bg-white"
                }`}
                aria-hidden="true"
              >
                {index < step ? "✓" : index + 1}
              </span>
              {index < 3 && (
                <span
                  className={`absolute left-1/2 top-3.5 h-px w-full ${
                    index < step ? "bg-[#84936d]" : "bg-[#e2e4dc]"
                  }`}
                  aria-hidden="true"
                />
              )}
              <span className="text-[10px] sm:text-xs">{label}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
export default OrderDetails
