"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

export default function NavLinks() {
  const pathname = usePathname()
  const isShopActive =
    pathname?.includes("/online-order") ||
    pathname?.includes("/store") ||
    pathname?.includes("/products") ||
    pathname?.includes("/categories")
  const isAboutActive = pathname?.includes("/about")
  const isContactActive = pathname?.includes("/contact")

  return (
    <div className="hidden small:flex items-center gap-x-8 text-[13px] font-normal tracking-[0.06em]">
      <div className="relative py-1">
        <LocalizedClientLink
          href="/about"
          className="transition-colors duration-200 hover:text-[var(--color-brand)] text-current"
          data-testid="nav-about-link"
        >
          About Us
        </LocalizedClientLink>
        {isAboutActive && (
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-current transition-all duration-200" />
        )}
      </div>

      <div className="relative py-1">
        <LocalizedClientLink
          href="/online-order"
          className="transition-colors duration-200 hover:text-[var(--color-brand)] text-current"
          data-testid="nav-shop-link"
        >
          Shop
        </LocalizedClientLink>
        {isShopActive && (
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-current transition-all duration-200" />
        )}
      </div>

      <div className="relative py-1">
        <LocalizedClientLink
          href="/contact"
          className="transition-colors duration-200 hover:text-[var(--color-brand)] text-current"
          data-testid="nav-contact-link"
        >
          Contact Us
        </LocalizedClientLink>
        {isContactActive && (
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-current transition-all duration-200" />
        )}
      </div>
    </div>
  )
}
