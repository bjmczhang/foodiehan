import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) return null
  const [shippingMethods, paymentMethods] = await Promise.all([
    listCartShippingMethods(cart.id),
    listCartPaymentMethods(cart.region?.id ?? ""),
  ])
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      {!customer && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#eeefe7] px-6 py-4 text-sm">
          <p>Already part of the Foodiehan family?</p>
          <LocalizedClientLink href="/account" className="text-link">
            Sign in
          </LocalizedClientLink>
        </div>
      )}
      <Addresses cart={cart} customer={customer} />
      <Shipping cart={cart} availableShippingMethods={shippingMethods ?? []} />
      <Payment cart={cart} availablePaymentMethods={paymentMethods ?? []} />
      <Review cart={cart} />
    </div>
  )
}
