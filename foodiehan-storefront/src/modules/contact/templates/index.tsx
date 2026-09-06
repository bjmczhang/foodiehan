import ContactForm from "@modules/contact/components/contact-form"
import FaqSection from "@modules/contact/components/faq-section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ContactTemplate() {
  return (
    <div className="page-shell">
      <div className="mb-14">
        <p className="eyebrow mb-5">We’re happy to help</p>
        <h1 className="page-title">Let’s talk.</h1>
        <p className="page-description mt-6">
          A question, an idea, or a little feedback? We’d love to hear from you.
        </p>
      </div>
      <div className="grid small:grid-cols-[.8fr_1.2fr] gap-10 small:gap-20 mb-20">
        <aside>
          <div className="bg-[#eaece1] rounded-2xl p-8 small:p-10">
            <p className="eyebrow mb-4">A little guidance</p>
            <h2 className="font-serif text-3xl leading-tight text-[#323c2b]">
              Good conversations
              <br />
              start here.
            </h2>
            <div className="mt-8 space-y-7 text-sm">
              <div>
                <h3 className="font-medium mb-2">Questions about an order</h3>
                <p className="text-[#73766c] leading-6">
                  Include your order number so we can find the details.
                </p>
                <LocalizedClientLink
                  href="/account/orders"
                  className="text-link mt-3"
                >
                  View my orders ↗
                </LocalizedClientLink>
              </div>
              <div className="border-t border-[#cfd4c4] pt-6">
                <h3 className="font-medium mb-2">
                  Product & ingredient enquiries
                </h3>
                <p className="text-[#73766c] leading-6">
                  Tell us which product you have in mind. We’ll help with the
                  details before you order.
                </p>
              </div>
              <div className="border-t border-[#cfd4c4] pt-6">
                <h3 className="font-medium mb-2">Something else?</h3>
                <p className="text-[#73766c] leading-6">
                  Partnerships, feedback or a simple hello. Choose a topic and
                  leave us a note.
                </p>
              </div>
            </div>
          </div>
          <a href="#faq" className="text-link mt-7">
            Explore frequently asked questions ↓
          </a>
        </aside>
        <section className="surface-panel">
          <h2 className="text-2xl font-serif mb-2">Send us a note.</h2>
          <p className="text-xs text-[#73766c] mb-8">
            Fields marked * are required.
          </p>
          <ContactForm />
        </section>
      </div>
      <FaqSection />
    </div>
  )
}
