import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type PolicySection = {
  title: string
  content: React.ReactNode
}

type PolicyTemplateProps = {
  badge: string
  title: string
  subtitle: string
  lastUpdated?: string
  sections: PolicySection[]
  quickLinks?: { label: string; href: string }[]
}

export default function PolicyTemplate({
  badge,
  title,
  subtitle,
  lastUpdated = "October 2026",
  sections,
  quickLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund & Returns Policy", href: "/refund-policy" },
    { label: "Shipping & Delivery Policy", href: "/shipping-policy" },
    { label: "Contact Us & FAQs", href: "/contact" },
  ],
}: PolicyTemplateProps) {
  return (
    <div className="page-shell">
      <div className="mb-12">
        <p className="eyebrow mb-4">{badge}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description mt-5 max-w-2xl">{subtitle}</p>
        <p className="text-xs text-[#73766c] mt-3">Last updated: {lastUpdated}</p>
      </div>

      <div className="grid small:grid-cols-[280px_minmax(0,1fr)] gap-10 small:gap-16 items-start mb-20">
        <aside className="space-y-6 small:sticky small:top-28">
          <div className="bg-[#eaece1] rounded-2xl p-6 sm:p-7">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4a5440] mb-4">
              Policies & Help
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="text-[#555a4e] hover:text-[#272b24] hover:underline transition-colors block py-1"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#e2e4dc] rounded-2xl p-6 text-sm text-[#73766c]">
            <h4 className="font-medium text-[#272b24] mb-2">Need clarification?</h4>
            <p className="leading-6 mb-4">
              Our team is always here to assist with questions about ingredients, orders, or our policies.
            </p>
            <LocalizedClientLink href="/contact" className="button-secondary w-full text-center block">
              Contact Us ↗
            </LocalizedClientLink>
          </div>
        </aside>

        <article className="surface-panel !p-8 sm:!p-12 space-y-10 text-sm leading-7 text-[#555a4e]">
          {sections.map((section, idx) => (
            <section key={idx} className="border-b border-[#e2e4dc] pb-8 last:border-b-0 last:pb-0">
              <h2 className="font-serif text-2xl text-[#272b24] mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}

