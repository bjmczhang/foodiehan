import ContactForm from "@modules/contact/components/contact-form"
import FaqSection from "@modules/contact/components/faq-section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ContactTemplate() {
  return (
    <div className="bg-white min-h-screen py-14 small:py-20">
      <div className="content-container max-w-[1440px] mx-auto px-6">
        {/* Page Title */}
        <h1
          className="mb-4 text-3xl font-light tracking-wide text-center small:text-4xl medium:text-5xl text-[#1a1a1a]"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Contact Us
        </h1>

        {/* Intro Text */}
        <div className="max-w-2xl mx-auto mb-12 text-center text-sm small:text-base leading-relaxed text-[#555555] space-y-1.5">
          <p>
            Have a question or want to leave feedback? Drop us a line!
          </p>
          <p>
            If you are a wholesale customer, please visit our{" "}
            <LocalizedClientLink
              href="/contact"
              className="text-[#1a1a1a] underline hover:opacity-75 transition-opacity"
            >
              wholesale page
            </LocalizedClientLink>
          </p>
        </div>

        {/* Contact Form */}
        <div className="mb-24 small:mb-32">
          <ContactForm />
        </div>

        {/* FAQ Section */}
        <div className="pb-12">
          <FaqSection />
        </div>
      </div>
    </div>
  )
}

