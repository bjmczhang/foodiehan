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
          We&apos;d love to hear from you — whether you have a question about our
          products, want to place a special order, or just want to say hello.{" "}
          For wholesale enquiries, please visit our{" "}
          <LocalizedClientLink
            href="/contact"
            className="text-[var(--color-brand)] hover:underline"
          >
            wholesale page
          </LocalizedClientLink>
          .
        </p>

        {/* Contact Form + Store Info — two columns on desktop */}
        <div className="grid grid-cols-1 gap-16 mb-24 small:grid-cols-2">
          <ContactForm />

          {/* Store Information */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-primary)]">
              Visit Us
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase text-[var(--color-text-primary)]">
                  Address
                </h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  123 Bakery Street
                  <br />
                  Sydney NSW 2000
                  <br />
                  Australia
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase text-[var(--color-text-primary)]">
                  Opening Hours
                </h3>
                <div className="text-[var(--color-text-secondary)] leading-relaxed space-y-1">
                  <p>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      Mon – Fri:
                    </span>{" "}
                    7:00 am – 6:00 pm
                  </p>
                  <p>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      Saturday:
                    </span>{" "}
                    8:00 am – 5:00 pm
                  </p>
                  <p>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      Sunday:
                    </span>{" "}
                    8:00 am – 3:00 pm
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase text-[var(--color-text-primary)]">
                  Phone
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  <a
                    href="tel:+61290000000"
                    className="hover:text-[var(--color-brand)] transition-colors"
                  >
                    +61 2 9000 0000
                  </a>
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase text-[var(--color-text-primary)]">
                  Email
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  <a
                    href="mailto:hello@foodiehan.com"
                    className="hover:text-[var(--color-brand)] transition-colors"
                  >
                    hello@foodiehan.com
                  </a>
                </p>
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="mt-8 overflow-hidden rounded-lg aspect-[4/3]"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div className="flex items-center justify-center w-full h-full text-sm text-[var(--color-text-muted)]">
                <div className="text-center">
                  <svg
                    className="w-10 h-10 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p>123 Bakery Street, Sydney NSW 2000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FaqSection />
      </div>
    </div>
  )
}
