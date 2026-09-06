"use client"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useState } from "react"
import { XMark } from "@medusajs/icons"
import { useToggleState } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

export default function SideMenu({
  regions,
  locales,
  currentLocale,
}: {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}) {
  const [open, setOpen] = useState(false)
  const countryToggle = useToggleState()
  const languageToggle = useToggleState()
  return (
    <>
      <button
        className="icon-button"
        aria-label="Open menu"
        data-testid="nav-menu-button"
        onClick={() => setOpen(true)}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 7h16M4 12h16M4 17h11" />
        </svg>
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-[80]">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />
        <DialogPanel
          className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-[#f8f7f3] p-8 overflow-y-auto"
          data-testid="nav-menu-popup"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="font-serif text-3xl text-[#323c2b]">
              foodiehan
            </DialogTitle>
            <button
              className="icon-button"
              aria-label="Close menu"
              data-testid="close-menu-button"
              onClick={() => setOpen(false)}
            >
              <XMark />
            </button>
          </div>
          <nav
            className="my-12 flex flex-col gap-7"
            aria-label="Mobile navigation"
          >
            {[
              ["About Us", "/about"],
              ["Shop", "/store"],
              ["Contact Us", "/contact"],
            ].map(([label, href]) => (
              <LocalizedClientLink
                key={href}
                href={href}
                className="font-serif text-4xl text-[#323c2b]"
                onClick={() => setOpen(false)}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
          <div className="flex flex-col gap-5 border-t border-[#e2e4dc] pt-7 text-sm">
            {[
              ["My account", "/account"],
              ["My orders", "/account/orders"],
              ["Shopping bag", "/cart"],
            ].map(([label, href]) => (
              <LocalizedClientLink
                key={href}
                href={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </div>
          <div className="mt-auto pt-12 space-y-6 text-sm">
            {regions &&
              regions.flatMap((region) => region.countries || []).length >
                1 && (
                <CountrySelect regions={regions} toggleState={countryToggle} />
              )}
            {!!locales?.length && (
              <LanguageSelect
                locales={locales}
                currentLocale={currentLocale}
                toggleState={languageToggle}
              />
            )}
            <p className="eyebrow">A little everyday joy.</p>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  )
}
