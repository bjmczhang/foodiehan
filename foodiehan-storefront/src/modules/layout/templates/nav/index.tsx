import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { MagnifyingGlass, User, ShoppingCart } from "@medusajs/icons"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky inset-x-0 top-0 z-50 group">
      <header className="relative h-auto mx-auto duration-200 bg-[var(--color-bg-darkest)] ">
        <nav className="grid grid-cols-[40%_20%_40%] items-center w-full h-full text-xs uppercase content-container">
          <div className="flex items-center justify-end gap-x-4">
            <div className="small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>

            <div className="items-center hidden small:flex gap-x-16">
              <LocalizedClientLink
                className="text-white hover:text-[var(--color-brand)]"
                href="/"
                data-testid="nav-home-link"
              >
                Home
              </LocalizedClientLink>

              <LocalizedClientLink
                className="text-white hover:text-[var(--color-brand)]"
                href="/about"
                data-testid="nav-about-link"
              >
                About
              </LocalizedClientLink>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="flex items-center text-xl font-bold text-white uppercase"
              data-testid="nav-store-link"
            >
              <img
                src="/logo.svg"
                alt="FoodieHan"
                className="w-auto h-20 m-5"
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center justify-between gap-x-4">
            <div className="items-center hidden small:flex gap-x-16">
              <LocalizedClientLink
                className="text-white hover:text-[var(--color-brand)]"
                href="/online-order"
                data-testid="nav-online-order-link"
              >
                Online order
              </LocalizedClientLink>

              <LocalizedClientLink
                className="text-white hover:text-[var(--color-brand)]"
                href="/contact"
                data-testid="nav-contact-link"
              >
                Contact
              </LocalizedClientLink>
            </div>

            <div className="items-center hidden small:flex gap-x-4">
              <button
                aria-label="search"
                className="text-white hover:text-[var(--color-brand)] p-2"
              >
                <MagnifyingGlass className="w-5 h-5" />
              </button>

              <LocalizedClientLink
                className="text-white hover:text-[var(--color-brand)] p-2"
                href="/account"
                data-testid="nav-account-link"
              >
                <User className="w-5 h-5" />
              </LocalizedClientLink>

              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="flex items-center gap-2 hover:text-[var(--color-brand)] p-2"
                    href="/cart"
                    data-testid="nav-cart-link"
                    aria-label="Cart"
                  ></LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
