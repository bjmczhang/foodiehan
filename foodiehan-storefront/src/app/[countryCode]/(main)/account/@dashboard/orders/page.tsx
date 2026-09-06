import { Metadata } from "next"
import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import { retrieveCustomer } from "@lib/data/customer"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Your orders",
  description:
    "View your Foodiehan orders, delivery details and payment status.",
}

export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  if (!(await retrieveCustomer())) return null
  const { page: requestedPage } = await searchParams
  const parsedPage = Number(requestedPage)
  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const orders = await listOrders(11, (page - 1) * 10)
  if (!orders) notFound()
  const hasNextPage = orders.length > 10
  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8">
        <p className="eyebrow mb-3">From our shop to your door</p>
        <h1 className="page-title">Your orders.</h1>
        <p className="page-description mt-4">
          Follow your latest finds and revisit your favourites.
        </p>
      </div>
      {page > 1 && orders.length === 0 ? (
        <div className="surface-panel">
          <p className="text-sm text-[#73766c]">
            There are no more orders on this page.
          </p>
          <LocalizedClientLink
            href="/account/orders"
            className="text-link mt-4 inline-flex"
          >
            Back to your orders
          </LocalizedClientLink>
        </div>
      ) : (
        <OrderOverview orders={orders.slice(0, 10)} />
      )}
      {(page > 1 || hasNextPage) && (
        <nav
          aria-label="Order pagination"
          className="mt-6 flex items-center justify-between gap-4"
        >
          {page > 1 ? (
            <LocalizedClientLink
              href={`/account/orders?page=${page - 1}`}
              className="button-secondary !px-5 !py-2.5"
            >
              ← Previous
            </LocalizedClientLink>
          ) : (
            <span />
          )}
          <span className="text-sm text-[#73766c]">Page {page}</span>
          {hasNextPage ? (
            <LocalizedClientLink
              href={`/account/orders?page=${page + 1}`}
              className="button-secondary !px-5 !py-2.5"
            >
              Next →
            </LocalizedClientLink>
          ) : (
            <span />
          )}
        </nav>
      )}
      <div className="mt-10">
        <TransferRequestForm />
      </div>
    </div>
  )
}
