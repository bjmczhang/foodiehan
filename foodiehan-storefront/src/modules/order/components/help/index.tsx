import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Help = () => (
  <section className="rounded-2xl border border-[#e2e4dc] bg-[#edf0e5] p-6">
    <h2 className="font-serif text-2xl">We’re here to help.</h2>
    <p className="mt-3 text-sm leading-6 text-[#73766c]">
      Questions about delivery, returns, or your order? Just get in touch.
    </p>
    <LocalizedClientLink
      href="/contact"
      className="text-link mt-5 inline-flex text-sm"
    >
      Contact us <span aria-hidden="true">↗</span>
    </LocalizedClientLink>
  </section>
)
export default Help
