import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

const PaymentDetails = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const payments =
    order.payment_collections?.flatMap(
      (collection) => collection.payments || []
    ) || []
  return (
    <section className="surface-panel">
      <h2 className="mb-5 font-serif text-2xl">Payment details.</h2>
      {payments.length ? (
        payments.map((payment) => {
          const info = paymentInfoMap[payment.provider_id]
          return (
            <div
              key={payment.id}
              className="flex flex-wrap items-center gap-4 border-[#e2e4dc] py-3 first:pt-0 last:pb-0 [&:not(:first-child)]:border-t"
            >
              {info?.icon && (
                <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl border border-[#e2e4dc] bg-[#f8f9f5]">
                  {info.icon}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" data-testid="payment-method">
                  {info?.title || "Payment"}
                </p>
                <p
                  className="mt-1 text-xs leading-6 text-[#73766c]"
                  data-testid="payment-amount"
                >
                  {isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `Card ending in ${payment.data.card_last4}`
                    : convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })}
                </p>
              </div>
              <span className="rounded-full bg-[#f0f2e9] px-3 py-1 text-xs capitalize text-[#626956]">
                {order.payment_status.replaceAll("_", " ")}
              </span>
            </div>
          )
        })
      ) : (
        <p className="text-sm leading-6 text-[#73766c]">
          Payment status:{" "}
          <span className="capitalize">
            {order.payment_status.replaceAll("_", " ")}
          </span>
          . Details will appear here when available.
        </p>
      )}
    </section>
  )
}
export default PaymentDetails
