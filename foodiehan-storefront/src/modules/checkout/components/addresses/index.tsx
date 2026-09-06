"use client"
import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "address"
  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart.shipping_address, cart.billing_address)
      : true
  )
  const [message, formAction] = useActionState(setAddresses, null)
  const address = cart?.shipping_address
  const billing = cart?.billing_address

  return (
    <section className="surface-panel">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#73766c]">01</span>
          <h2 className="font-serif text-[26px] font-normal tracking-tight">
            Your details
          </h2>
          {!isOpen && address?.address_1 && (
            <CheckCircleSolid className="text-[#6c785b]" />
          )}
        </div>
        {!isOpen && address && (
          <button
            onClick={() =>
              router.push(pathname + "?step=address", { scroll: false })
            }
            className="text-link text-xs"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>
      {isOpen ? (
        <form action={formAction} className="mt-6">
          <p className="mb-6 text-sm leading-6 text-[#73766c]">
            Tell us where your order should go. Fields marked with an asterisk
            are required.
          </p>
          <ShippingAddress
            customer={customer}
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />
          {!sameAsBilling && (
            <div className="mt-6 border-t border-[#e2e4dc] pt-6">
              <h3 className="mb-5 text-base font-medium">Billing address</h3>
              <BillingAddress cart={cart} />
            </div>
          )}
          <SubmitButton
            className="mt-6 w-full small:w-auto"
            data-testid="submit-address-button"
          >
            Continue to delivery
          </SubmitButton>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </form>
      ) : address?.address_1 ? (
        <div className="mt-6 grid gap-6 text-sm leading-6 small:grid-cols-2">
          <div data-testid="shipping-address-summary">
            <h3 className="mb-1 font-medium">Delivery address</h3>
            <p className="text-[#73766c]">
              {address.first_name} {address.last_name}
              <br />
              {address.address_1}
              {address.address_2 && ", " + address.address_2}
              <br />
              {address.city} {address.postal_code}
              <br />
              {address.country_code?.toUpperCase()}
            </p>
          </div>
          <div data-testid="shipping-contact-summary">
            <h3 className="mb-1 font-medium">Contact</h3>
            <p className="break-all text-[#73766c]">{cart?.email}</p>
            {address.phone && <p className="text-[#73766c]">{address.phone}</p>}
          </div>
          <div
            className="small:col-span-2"
            data-testid="billing-address-summary"
          >
            <h3 className="mb-1 font-medium">Billing address</h3>
            {sameAsBilling ? (
              <p className="text-[#73766c]">Same as your delivery address.</p>
            ) : (
              <p className="text-[#73766c]">
                {billing?.first_name} {billing?.last_name}
                <br />
                {billing?.address_1} {billing?.address_2}
                <br />
                {billing?.city} {billing?.postal_code} ·{" "}
                {billing?.country_code?.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#73766c]">
          Add your contact and delivery details.
        </p>
      )}
    </section>
  )
}
export default Addresses
