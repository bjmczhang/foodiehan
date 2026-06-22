import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterForm from "./newsletter-form"

export default async function Footer() {
  return (
    <footer
      className="w-full text-[var(--color-text-light)]"
      style={{ backgroundColor: "var(--color-bg-dark)" }}
    >
      {/* Main footer columns */}
      <div className="content-container max-w-[1200px] mx-auto py-16 small:py-20">
        <div className="grid grid-cols-2 medium:grid-cols-3 large:grid-cols-5 gap-10">
          {/* Column 1: Customer Care */}
          <div>
            <h4
              className="mb-5 text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-text-light)" }}
            >
              Customer Care
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <LocalizedClientLink
                  href="/contact"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Contact us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/about"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Careers
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/contact"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  FAQ
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4
              className="mb-5 text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-text-light)" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <LocalizedClientLink
                  href="/contact"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Wholesale
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/contact"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Catering
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Logo (center anchor) */}
          <div className="flex items-start justify-center">
            <LocalizedClientLink
              href="/"
              className="flex flex-col items-center gap-3"
            >
              <img
                src="/logo.svg"
                alt="FoodieHan"
                className="w-auto h-14 brightness-0 invert"
              />
              <span className="text-xs font-light tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
                Artisan Bakery
              </span>
            </LocalizedClientLink>
          </div>

          {/* Column 4: Explore */}
          <div>
            <h4
              className="mb-5 text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-text-light)" }}
            >
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <LocalizedClientLink
                  href="/online-order"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Our Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/online-order"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Dine in Menu
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/online-order"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Order Pickup
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Column 5: Our Socials */}
          <div>
            <h4
              className="mb-5 text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-text-light)" }}
            >
              Our Socials
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div
        className="py-6 border-t"
        style={{
          backgroundColor: "var(--color-bg-darker)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="content-container max-w-[1200px] mx-auto flex flex-col small:flex-row items-center justify-between gap-4 text-xs font-light text-[var(--color-text-muted)]">
          <span>© {new Date().getFullYear()} FoodieHan. All rights reserved.</span>
          <div className="flex gap-6">
            <a
              href="#"
              className="transition-colors duration-200 hover:text-[var(--color-brand)]"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-[var(--color-brand)]"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
