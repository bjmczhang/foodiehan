import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

const ShippingDetails = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const address = order.shipping_address
  const methods = order.shipping_methods || []
  return (
    <section className="surface-panel">
      <h2 className="mb-5 font-serif text-2xl">Delivery details.</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div data-testid="shipping-address-summary">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-[#73766c]">
            Deliver to
          </h3>
          {address ? (
            <address className="text-sm not-italic leading-6">
              <p>
                {address.first_name} {address.last_name}
              </p>
              {address.company && <p>{address.company}</p>}
              <p>{address.address_1}</p>
              {address.address_2 && <p>{address.address_2}</p>}
              <p>
                {[address.city, address.province, address.postal_code]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>{address.country_code?.toUpperCase()}</p>
            </address>
          ) : (
            <p className="text-sm text-[#73766c]">
              No delivery address supplied.
            </p>
          )}
        </div>
        <div data-testid="shipping-contact-summary">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-[#73766c]">
            Contact details
          </h3>
          <p className="break-words text-sm leading-6">{order.email}</p>
          {address?.phone && (
            <p className="text-sm leading-6">{address.phone}</p>
          )}
        </div>
        <div
          data-testid="shipping-method-summary"
          className="border-t border-[#e2e4dc] pt-4 sm:col-span-2"
        >
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-[#73766c]">
            Delivery method
          </h3>
          {methods.length ? (
            methods.map((method) => (
              <div
                key={method.id}
                className="flex justify-between gap-4 text-sm leading-6"
              >
                <span>{method.name || "Delivery"}</span>
                <span>
                  {convertToLocale({
                    amount: method.total ?? 0,
                    currency_code: order.currency_code,
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#73766c]">
              Delivery details will appear here when available.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
export default ShippingDetails
