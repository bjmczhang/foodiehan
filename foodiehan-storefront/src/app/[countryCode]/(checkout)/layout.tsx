import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#272b24]">
      <header className="border-b border-[#e2e4dc] bg-white">
        <nav
          className="mx-auto grid h-24 max-w-[1280px] grid-cols-3 items-center px-6 small:px-12"
          aria-label="Checkout navigation"
        >
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-2 text-sm text-[#73766c] hover:text-[#323c2b]"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:inline">Back to cart</span>
            <span className="small:hidden">Cart</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="justify-self-center font-serif text-3xl tracking-tight text-[#323c2b]"
            data-testid="store-link"
          >
            foodiehan<span className="text-[#9b865e]">.</span>
          </LocalizedClientLink>
          <div className="flex items-center justify-end gap-2 text-xs text-[#73766c]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V6a4 4 0 0 1 8 0v4" />
            </svg>
            <span className="hidden small:inline">Secure checkout</span>
          </div>
        </nav>
      </header>
      <main id="main-content" data-testid="checkout-container">
        {children}
      </main>
      <footer className="mx-auto flex max-w-[1184px] flex-col items-center justify-between gap-4 border-t border-[#e2e4dc] px-6 py-8 text-xs text-[#73766c] small:flex-row">
        <p>
          © {new Date().getFullYear()} Foodiehan. Made for everyday moments.
        </p>
        <LocalizedClientLink href="/contact" className="text-link">
          Need help? Contact us
        </LocalizedClientLink>
      </footer>
    </div>
  )
}
