import { Suspense } from "react"
import { User, ShoppingBag } from "@medusajs/icons"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchInput from "@modules/layout/components/search-input"
import NavLinks from "./nav-links"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().catch(() => []),
    listLocales(),
    getLocale(),
  ])
  return (
    <header className="store-header">
      <div className="announcement-bar">
        A LITTLE EVERYDAY JOY, FRESH FROM FOODIEHAN
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <div>
          <div className="small:hidden">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>
          <NavLinks />
        </div>
        <LocalizedClientLink
          href="/"
          className="brand-link"
          data-testid="nav-store-link"
          aria-label="FoodieHan home"
        >
          <div className="brand-wordmark">
            foodie<span>han</span>
            <span className="brand-caption">BAKED WITH A LITTLE SEOUL</span>
          </div>
        </LocalizedClientLink>
        <div className="flex items-center justify-end gap-0 small:gap-2">
          <SearchInput />
          <LocalizedClientLink
            href="/account"
            className="icon-button"
            aria-label="My account"
            data-testid="nav-account-link"
          >
            <User className="h-5 w-5" />
          </LocalizedClientLink>
          <Suspense
            fallback={
              <LocalizedClientLink
                href="/cart"
                className="icon-button"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-5 w-5" />
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </nav>
    </header>
  )
}
