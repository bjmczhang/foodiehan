import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { MagnifyingGlass, User } from "@medusajs/icons"
import NavClient from "./nav-client"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: HttpTypes.StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <NavClient>
      <nav className="flex items-center justify-between w-full h-full py-5 text-xs uppercase content-container">
        {/* Logo - 最左边 */}
        <div className="flex items-center">
          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="nav-store-link"
          >
            <img src="/logo.svg" alt="FoodieHan" className="w-auto h-14" />
          </LocalizedClientLink>
        </div>

        {/* 中间导航链接 */}
        <div className="flex items-center gap-x-8">
          <div className="small:hidden">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          <div className="items-center hidden text-sm font-medium small:flex gap-x-8">
            <LocalizedClientLink
              showHoverUnderline={true}
              underlineColor={"var(--color-brand)"}
              href="/"
              data-testid="nav-home-link"
            >
              Home
            </LocalizedClientLink>

            <LocalizedClientLink
              showHoverUnderline={true}
              underlineColor={"var(--color-brand)"}
              href="/about"
              data-testid="nav-about-link"
            >
              About
            </LocalizedClientLink>

            <LocalizedClientLink
              showHoverUnderline={true}
              underlineColor={"var(--color-brand)"}
              href="/online-order"
              data-testid="nav-online-order-link"
            >
              Online order
            </LocalizedClientLink>

            <LocalizedClientLink
              showHoverUnderline={true}
              underlineColor={"var(--color-brand)"}
              href="/contact"
              data-testid="nav-contact-link"
            >
              Contact
            </LocalizedClientLink>
          </div>
        </div>

        {/* 右侧图标 */}
        <div className="flex items-center gap-x-4">
          <button
            aria-label="search"
            className="text-[var(--color-text-primary)] hover:text-[var(--color-brand)] p-2 transition-colors duration-200"
          >
            <MagnifyingGlass className="w-5 h-5" />
          </button>

          <LocalizedClientLink
            className="text-[var(--color-text-primary)] hover:text-[var(--color-brand)] p-2 transition-colors duration-200"
            href="/account"
            data-testid="nav-account-link"
          >
            <User className="w-5 h-5" />
          </LocalizedClientLink>

          <Suspense
            fallback={
              <LocalizedClientLink
                className="flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand)] p-2 transition-colors duration-200"
                href="/cart"
                data-testid="nav-cart-link"
                aria-label="Cart"
              ></LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </nav>
    </NavClient>
  )
}
