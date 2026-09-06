import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Package from "@modules/common/icons/package"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const completion = getProfileCompletion(customer)
  return (
    <div data-testid="overview-page-wrapper">
      <p className="eyebrow mb-3">Your account</p>
      <h1
        className="page-title"
        data-testid="welcome-message"
        data-value={customer?.first_name}
      >
        Hello, {customer?.first_name || "there"}.
      </h1>
      <p className="page-description mt-4">
        Good to have you here. Make yourself at home.
      </p>
      <span
        className="sr-only"
        data-testid="customer-email"
        data-value={customer?.email}
      >
        {customer?.email}
      </span>
      <div className="my-8 grid gap-4 sm:grid-cols-2">
        <LocalizedClientLink
          href="/account/profile"
          className="surface-panel group transition-colors hover:border-[#aab39a]"
        >
          <div className="flex items-center justify-between text-sm">
            <span>Your profile</span>
            <span aria-hidden="true">↗</span>
          </div>
          <p className="mt-5">
            <span
              className="font-serif text-4xl"
              data-testid="customer-profile-completion"
              data-value={completion}
            >
              {completion}%
            </span>
            <span className="ml-2 text-sm text-[#73766c]">complete</span>
          </p>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#eceee7]">
            <div
              className="h-full rounded-full bg-[#84936d]"
              style={{ width: `${completion}%` }}
            />
          </div>
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/account/addresses"
          className="surface-panel group transition-colors hover:border-[#aab39a]"
        >
          <div className="flex items-center justify-between text-sm">
            <span>Address book</span>
            <span aria-hidden="true">↗</span>
          </div>
          <p className="mt-5">
            <span
              className="font-serif text-4xl"
              data-testid="addresses-count"
              data-value={customer?.addresses?.length || 0}
            >
              {customer?.addresses?.length || 0}
            </span>
            <span className="ml-2 text-sm text-[#73766c]">saved addresses</span>
          </p>
          <p className="mt-4 text-xs text-[#73766c]">
            Ready for your next delivery.
          </p>
        </LocalizedClientLink>
      </div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl">Recent orders</h2>
        <LocalizedClientLink
          href="/account/orders"
          className="text-link text-sm"
        >
          View all <span aria-hidden="true">↗</span>
        </LocalizedClientLink>
      </div>
      <ul className="space-y-3" data-testid="orders-wrapper">
        {orders?.length ? (
          orders.slice(0, 5).map((order) => (
            <li
              key={order.id}
              data-testid="order-wrapper"
              data-value={order.id}
            >
              <LocalizedClientLink
                href={`/account/orders/details/${order.id}`}
                className="surface-panel flex flex-wrap items-center justify-between gap-4 transition-colors hover:border-[#aab39a]"
                data-testid="open-order-button"
                aria-label={`View order ${order.display_id}`}
              >
                <div className="flex items-center gap-4">
                  <span className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#f1f2eb] sm:flex">
                    <Package size={20} />
                  </span>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      data-testid="order-id"
                      data-value={order.display_id}
                    >
                      Order #{order.display_id}
                    </p>
                    <p
                      className="mt-1 text-xs text-[#73766c]"
                      data-testid="order-created-date"
                    >
                      {new Date(order.created_at).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span
                    className="text-sm font-medium"
                    data-testid="order-amount"
                  >
                    {convertToLocale({
                      amount: order.total,
                      currency_code: order.currency_code,
                    })}
                  </span>
                  <span aria-hidden="true">→</span>
                </div>
              </LocalizedClientLink>
            </li>
          ))
        ) : (
          <li
            className="surface-panel flex flex-col items-center !py-12 text-center"
            data-testid="no-orders-message"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#edf0e5]">
              <Package size={24} />
            </span>
            <h3 className="font-serif text-2xl">
              Your next favourite is waiting.
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#73766c]">
              Once you place your first order, you can follow it here.
            </p>
            <LocalizedClientLink href="/store" className="button-primary mt-6">
              Explore the shop <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
          </li>
        )}
      </ul>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return 0
  return (
    [
      customer.email,
      customer.first_name && customer.last_name,
      customer.phone,
      customer.addresses?.some((address) => address.is_default_billing),
    ].filter(Boolean).length * 25
  )
}

export default Overview
