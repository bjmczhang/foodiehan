import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const quantity =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0
  return (
    <div className="page-shell" data-testid="cart-container">
      {cart?.items?.length ? (
        <>
          <div className="mb-10 flex flex-col gap-5 small:flex-row small:items-end small:justify-between">
            <div>
              <p className="eyebrow mb-3">A little something good</p>
              <h1 className="page-title">
                Your cart
                <span className="ml-3 align-top font-sans text-lg text-[#73766c]">
                  ({quantity})
                </span>
              </h1>
              <p className="page-description mt-4">
                Your favourites, ready for their next stop.
              </p>
            </div>
            <LocalizedClientLink href="/store" className="text-link text-sm">
              Continue shopping <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-8 large:grid-cols-[minmax(0,1fr)_370px] large:gap-12">
            <div className="min-w-0 space-y-6">
              <section className="surface-panel" aria-label="Cart items">
                <ItemsTemplate cart={cart} />
              </section>
              {!customer && <SignInPrompt />}
            </div>
            <aside className="min-w-0">
              {cart.region && (
                <div className="surface-panel large:sticky large:top-28">
                  <Summary cart={cart} />
                </div>
              )}
              <p className="mt-5 text-center text-xs leading-6 text-[#73766c]">
                Need a hand with your order?{" "}
                <LocalizedClientLink href="/contact" className="text-link">
                  Contact us
                </LocalizedClientLink>
              </p>
            </aside>
          </div>
        </>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  )
}
export default CartTemplate
