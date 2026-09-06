"use client"

import { useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState("")
  const links = [
    {
      href: "/account",
      label: "Overview",
      testId: "overview-link",
      icon: (
        <span
          className="grid h-5 w-5 grid-cols-2 gap-1 p-0.5"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="rounded-[2px] border border-current" />
          ))}
        </span>
      ),
    },
    {
      href: "/account/orders",
      label: "My orders",
      testId: "orders-link",
      icon: <Package size={20} />,
    },
    {
      href: "/account/profile",
      label: "Profile",
      testId: "profile-link",
      icon: <User size={20} />,
    },
    {
      href: "/account/addresses",
      label: "Addresses",
      testId: "addresses-link",
      icon: <MapPin size={20} />,
    },
  ]
  const handleLogout = async () => {
    setLoggingOut(true)
    setError("")
    try {
      await signout(countryCode)
    } catch {
      setError("We couldn’t sign you out. Please try again.")
      setLoggingOut(false)
    }
  }
  return (
    <nav
      aria-label="Account navigation"
      className="small:sticky small:top-28"
      data-testid="account-nav"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8ebdf] font-serif text-xl uppercase text-[#323c2b]">
          {customer?.first_name?.[0] || customer?.email?.[0] || "F"}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {customer?.first_name || "My account"}
          </p>
          <p className="mt-1 truncate text-xs text-[#73766c]">
            {customer?.email}
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2 small:grid-cols-1">
        {links.map(({ href, label, testId, icon }) => {
          const path = route?.slice(countryCode.length + 1)
          const active =
            href === "/account" ? path === href : path?.startsWith(href)
          return (
            <li key={href}>
              <LocalizedClientLink
                href={href}
                data-testid={testId}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-[#323c2b] font-medium text-white"
                    : "text-[#626956] hover:bg-[#e8ebdf]"
                }`}
              >
                {icon}
                {label}
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        data-testid="logout-button"
        className="mt-4 flex min-h-11 items-center gap-3 px-4 text-sm text-[#73766c] transition-colors hover:text-[#272b24] disabled:opacity-50 small:mt-8"
      >
        <ArrowRightOnRectangle />
        {loggingOut ? "Signing out…" : "Sign out"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </nav>
  )
}

export default AccountNav
