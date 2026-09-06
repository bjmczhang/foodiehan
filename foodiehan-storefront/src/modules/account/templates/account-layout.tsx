import React from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AccountNav from "../components/account-nav"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout = ({ customer, children }: AccountLayoutProps) => (
  <div className="page-shell flex-1" data-testid="account-page">
    {customer ? (
      <div className="grid min-w-0 gap-8 small:grid-cols-[230px_minmax(0,1fr)] small:gap-12">
        <aside>
          <AccountNav customer={customer} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    ) : (
      children
    )}
    <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[#e2e4dc] pt-8 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-base font-semibold">
          A little help, whenever you need it.
        </h2>
        <p className="mt-1 text-sm text-[#73766c]">
          Questions about your account or an order? We’re here for you.
        </p>
      </div>
      <LocalizedClientLink href="/contact" className="text-link shrink-0">
        Contact us <span aria-hidden="true">↗</span>
      </LocalizedClientLink>
    </div>
  </div>
)

export default AccountLayout
