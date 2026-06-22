import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { MagnifyingGlass, User } from "@medusajs/icons"
import SearchInput from "@modules/layout/components/search-input"
import NavClient from "./nav-client"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: HttpTypes.StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <NavClient>
      <nav className="flex items-center justify-between w-full h-[72px] px-6 lg:px-12 container-2xl">
        {/* Mobile hamburger */}
        <div className="small:hidden">
          <SideMenu
            regions={regions}
            locales={locales}
            currentLocale={currentLocale}
          />
        </div>

        {/* Logo — left */}
        <div className="flex items-center flex-shrink-0">
          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="nav-store-link"
          >
            <img
              src="/logo.svg"
              alt="FoodieHan"
              className="w-auto h-10 small:h-12"
            />
          </LocalizedClientLink>
        </div>

        {/* Nav links — center-right */}
        <div className="hidden small:flex items-center gap-x-8 text-sm font-light tracking-wider uppercase">
          <LocalizedClientLink
            href="/about"
            className="transition-colors duration-200 hover:text-[var(--color-brand)]"
            data-testid="nav-about-link"
          >
            About Us
          </LocalizedClientLink>

          {/* Shop with dropdown */}
          <div className="relative group">
            <LocalizedClientLink
              href="/online-order"
              className="flex items-center gap-1 transition-colors duration-200 hover:text-[var(--color-brand)]"
              data-testid="nav-shop-link"
            >
              Shop
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:rotate-180"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </LocalizedClientLink>

            {/* Dropdown menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white text-[var(--color-text-primary)] shadow-lg rounded-sm py-3 px-6 min-w-[180px]">
                <LocalizedClientLink
                  href="/online-order"
                  className="block py-2 text-xs font-light tracking-wider uppercase transition-colors duration-200 hover:text-[var(--color-brand)] whitespace-nowrap"
                >
                  View Products
                </LocalizedClientLink>
                <a
                  href="https://order.laurent.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-xs font-light tracking-wider uppercase transition-colors duration-200 hover:text-[var(--color-brand)] whitespace-nowrap"
                >
                  Order Online
                </a>
              </div>
            </div>
          </div>

          <LocalizedClientLink
            href="/contact"
            className="transition-colors duration-200 hover:text-[var(--color-brand)]"
            data-testid="nav-locations-link"
          >
            Locations
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/contact"
            className="transition-colors duration-200 hover:text-[var(--color-brand)]"
            data-testid="nav-contact-link"
          >
            Contact Us
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/contact"
            className="transition-colors duration-200 hover:text-[var(--color-brand)]"
            data-testid="nav-wholesale-link"
          >
            Wholesale
          </LocalizedClientLink>
        </div>

        {/* Utility icons — right */}
        <div className="flex items-center gap-x-1 small:gap-x-3">
          <div className="hidden small:block">
            <SearchInput />
          </div>

          <Suspense
            fallback={
              <LocalizedClientLink
                className="flex items-center gap-2 p-2 transition-colors duration-200 hover:text-[var(--color-brand)]"
                href="/cart"
                data-testid="nav-cart-link"
                aria-label="Cart"
              />
            }
          >
            <CartButton />
          </Suspense>

          <LocalizedClientLink
            className="p-2 transition-colors duration-200 hover:text-[var(--color-brand)]"
            href="/account"
            data-testid="nav-account-link"
          >
            <User className="w-5 h-5" />
          </LocalizedClientLink>
        </div>
      </nav>
    </NavClient>
  )
}
