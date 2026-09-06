import LocalizedClientLink from "@modules/common/components/localized-client-link"
const EmptyCartMessage = () => (
  <section
    className="mx-auto flex min-h-[52vh] max-w-xl flex-col items-center justify-center py-12 text-center"
    data-testid="empty-cart-message"
  >
    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#eaece3] text-[#323c2b]">
      <svg
        width="38"
        height="38"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d="M7 10h18l2 18H5l2-18Z" />
        <path d="M11 11V8a5 5 0 0 1 10 0v3" />
      </svg>
    </div>
    <p className="eyebrow mb-4">Good things await</p>
    <h1 className="page-title">A little room for joy.</h1>
    <p className="page-description mt-5">
      Your cart is empty for now. Explore the collection and find something to
      make your day a little sweeter.
    </p>
    <LocalizedClientLink href="/store" className="button-primary mt-8">
      Explore the shop <span aria-hidden="true">↗</span>
    </LocalizedClientLink>
  </section>
)
export default EmptyCartMessage
