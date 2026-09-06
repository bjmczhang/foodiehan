import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell !pb-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 small:grid-cols-[2fr_1fr_1fr_1.3fr] pb-14">
          <div className="col-span-2 small:col-span-1">
            <LocalizedClientLink
              href="/"
              className="font-serif text-5xl tracking-[-.06em]"
            >
              foodie<span className="italic">han</span>
            </LocalizedClientLink>
            <p className="mt-5 max-w-[260px] text-sm leading-7 text-[#d0d5c6]">
              Familiar comforts. A little discovery.
              <br />
              Something good for your every day.
            </p>
          </div>
          {[
            {
              title: "Explore",
              links: [
                ["About Us", "/about"],
                ["Shop all", "/store"],
                ["Contact Us", "/contact"],
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
          <div className="col-span-2 small:col-span-1">
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
        <div className="border-t border-white/15 pt-7 flex flex-col gap-4 sm:flex-row sm:justify-between text-[11px] text-[#bac2ae]">
          <p>© {new Date().getFullYear()} FoodieHan. All rights reserved.</p>
          <div className="flex gap-6">
            <LocalizedClientLink href="/contact#faq">
              FAQs & order help
            </LocalizedClientLink>
            <span>Made for the everyday.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
