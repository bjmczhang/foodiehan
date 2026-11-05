import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogo from "@modules/common/components/brand-logo"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell !pb-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-2 medium:grid-cols-[2fr_1fr_1.2fr_1fr_1.3fr] pb-14">
          <div className="col-span-2 medium:col-span-1">
            <LocalizedClientLink
              href="/"
              className="inline-block"
              aria-label="FoodieHan home"
            >
              <BrandLogo />
            </LocalizedClientLink>
            <p className="mt-5 max-w-[260px] text-sm leading-7 text-[#d0d5c6]">
              Familiar comforts. A little discovery.
              <br />
              Artisan bakery &amp; Korean delicacies in Sydney.
            </p>
          </div>
          {[
            {
              title: "Explore",
              links: [
                ["About Us", "/about"],
                ["Shop all", "/store"],
                ["Contact Us", "/contact"],
                ["FAQs & Help", "/contact#faq"],
              ],
            },
            {
              title: "Policies",
              links: [
                ["Shipping & Delivery", "/shipping-policy"],
                ["Refunds & Returns", "/refund-policy"],
                ["Privacy Policy", "/privacy"],
                ["Terms of Service", "/terms"],
              ],
            },
            {
              title: "Your FoodieHan",
              links: [
                ["My account", "/account"],
                ["My orders", "/account/orders"],
                ["Shopping bag", "/cart"],
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] uppercase tracking-[.15em] mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map(([label, href]) => (
                  <li key={href}>
                    <LocalizedClientLink href={href} className="footer-link">
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 medium:col-span-1">
            <h3 className="text-[11px] uppercase tracking-[.15em] mb-6">
              Let’s talk
            </h3>
            <p className="text-sm leading-7 text-[#d0d5c6]">
              Questions about an order,
              <br />
              or simply saying hello?
            </p>
            <LocalizedClientLink
              href="/contact"
              className="inline-flex gap-6 mt-5 border-b border-[#839073] pb-2 text-sm"
            >
              We’re here to help <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
          </div>
        </div>
        <div className="border-t border-white/15 pt-7 flex flex-col gap-4 sm:flex-row sm:justify-between items-center text-[11px] text-[#bac2ae]">
          <p>© {new Date().getFullYear()} FoodieHan. All rights reserved. Sydney, Australia.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <LocalizedClientLink href="/shipping-policy" className="hover:underline">
              Shipping Policy
            </LocalizedClientLink>
            <LocalizedClientLink href="/refund-policy" className="hover:underline">
              Refunds Policy
            </LocalizedClientLink>
            <LocalizedClientLink href="/privacy" className="hover:underline">
              Privacy
            </LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="hover:underline">
              Terms
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact#faq" className="hover:underline">
              FAQs
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
