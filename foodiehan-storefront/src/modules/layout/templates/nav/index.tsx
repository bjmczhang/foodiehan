import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { User } from "@medusajs/icons"
import SearchInput from "@modules/layout/components/search-input"
import NavClient from "./nav-client"
import NavLinks from "./nav-links"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: HttpTypes.StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <NavClient>
      <nav className="w-full h-[72px] px-6 lg:px-12 max-w-[1600px] mx-auto flex items-center justify-between relative">
        {/* Left Section: Mobile Menu & Desktop Nav Links */}
        <div className="flex items-center gap-x-4 flex-1 justify-start">
          <div className="small:hidden">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>
          <NavLinks />
        </div>

        {/* Center Section: Centered Brand Wordmark */}
        <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <LocalizedClientLink
            href="/"
            className="flex items-center justify-center text-current hover:opacity-85 transition-opacity"
            data-testid="nav-store-link"
          >
            <span
              className="text-xl small:text-2xl font-normal tracking-[0.28em] uppercase"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              FoodieHan
            </span>
          </LocalizedClientLink>
        </div>

        {/* Right Section: Utility Icons (Account, Search, Cart) */}
        <div className="flex items-center justify-end gap-x-1 small:gap-x-3 flex-1">
          <LocalizedClientLink
            className="p-2 transition-colors duration-200 hover:text-[var(--color-brand)] text-current"
            href="/account"
            data-testid="nav-account-link"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </LocalizedClientLink>

          <SearchInput />

          <Suspense
            fallback={
              <LocalizedClientLink
                className="flex items-center p-2 transition-colors duration-200 hover:text-[var(--color-brand)] text-current"
                href="/cart"
                data-testid="nav-cart-link"
                aria-label="Cart"
              />
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </nav>
    </NavClient>
  )
}

