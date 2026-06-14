import ContactForm from "@modules/contact/components/contact-form"
import FaqSection from "@modules/contact/components/faq-section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ContactTemplate() {
  return (
    <div className="py-16 content-container small:py-24">
      <div className="max-w-[1100px] mx-auto">
        {/* Page Title */}
        <h1 className="mb-8 text-3xl font-semibold text-center small:text-4xl text-[var(--color-text-primary)]">
          Contact Us
        </h1>

        {/* Intro Text */}
        <p className="max-w-2xl mx-auto mb-16 leading-relaxed text-center text-[var(--color-text-secondary)]">
          We&apos;d love to hear from you — whether you have a question about
          our products, want to place a special order, or just want to say
          hello. For wholesale enquiries, please visit our{" "}
          <LocalizedClientLink
            href="/contact"
            className="text-[var(--color-brand)] hover:underline"
          >
            wholesale page
          </LocalizedClientLink>
          .
        </p>

        {/* Contact Form + Store Info — two columns on desktop */}
        <div className="grid grid-cols-1 gap-16 mb-24">
          <ContactForm />

          {/* Store Information */}
        </div>

        {/* FAQ Section */}
        <FaqSection />
      </div>
    </div>
  )
}
