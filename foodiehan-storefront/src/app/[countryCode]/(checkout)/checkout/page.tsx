import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import EmptyCheckout from "../not-found"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Foodiehan order.",
}

export default async function Checkout({
  searchParams,
  params,
}: {
  searchParams: Promise<{ step?: string }>
  params: Promise<{ countryCode: string }>
}) {
  const cart = await retrieveCart()
  if (!cart?.items?.length) return <EmptyCheckout />
  const { step } = await searchParams
  const { countryCode } = await params
  const hasAddress = !!(
    cart.shipping_address?.address_1 &&
    cart.billing_address?.address_1 &&
    cart.email
  )
  const hasDelivery = !!cart.shipping_methods?.length
  const hasPayment = !!cart.payment_collection?.payment_sessions?.some(
    (session) => session.status === "pending"
  )
  const requestedStep = ["address", "delivery", "payment", "review"].includes(
    step ?? ""
  )
    ? step
    : undefined
  const validStep = !requestedStep
    ? hasAddress
      ? hasDelivery
        ? "payment"
        : "delivery"
      : "address"
    : !hasAddress
    ? "address"
    : !hasDelivery && ["payment", "review"].includes(requestedStep)
    ? "delivery"
    : !hasPayment && requestedStep === "review"
    ? "payment"
    : requestedStep
  if (validStep !== step)
    redirect("/" + countryCode + "/checkout?step=" + validStep)
  const customer = await retrieveCustomer()
  return (
    <div className="page-shell">
      <div className="mb-9">
        <p className="eyebrow mb-3">Almost yours</p>
        <h1 className="page-title">The good part is next.</h1>
        <p className="page-description mt-4">
          A few details, and we will take it from here.
        </p>
      </div>
      <CheckoutProgress cart={cart} />
      <div className="grid min-w-0 grid-cols-1 items-start gap-8 large:grid-cols-[minmax(0,1fr)_370px] large:gap-12">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
