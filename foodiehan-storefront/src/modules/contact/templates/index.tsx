import ContactForm from "@modules/contact/components/contact-form"
import FaqSection from "@modules/contact/components/faq-section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ContactTemplate() {
  return (
    <div className="py-16 small:py-24">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Page Title */}
        <h1
          className="mb-4 text-4xl font-light tracking-wide text-center small:text-5xl"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "var(--color-text-primary)",
          }}
        >
          Contact Us
        </h1>

        {/* Intro Text */}
        <p className="max-w-xl mx-auto mb-16 leading-relaxed text-center text-[var(--color-text-secondary)]">
          Have a question or want to leave feedback? Drop us a line! For
          wholesale enquiries, please visit our{" "}
          <LocalizedClientLink
            href="/contact"
            className="text-[var(--color-brand)] hover:underline"
          >
            wholesale page
          </LocalizedClientLink>
          .
        </p>

        {/* Contact Form */}
        <div className="mb-20">
          <ContactForm />
        </div>

        {/* FAQ Section */}
        <FaqSection />
      </div>
    </div>
  )
}
