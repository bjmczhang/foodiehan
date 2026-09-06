"use client"
import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function NavLinks() {
  const pathname = usePathname().split("/").slice(2).join("/")
  return (
    <div className="nav-links">
      {[
        { label: "About Us", href: "/about" },
        { label: "Shop", href: "/store" },
        { label: "Contact Us", href: "/contact" },
      ].map(({ label, href }) => {
        const active =
          pathname === href.slice(1) ||
          (href === "/store" &&
            /^(products|categories|collections|search|online-order)/.test(
              pathname
            ))
        return (
          <LocalizedClientLink
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </LocalizedClientLink>
        )
      })}
    </div>
  )
}
