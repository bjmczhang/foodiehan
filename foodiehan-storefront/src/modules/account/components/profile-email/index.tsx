import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ProfileEmail = ({ customer }: { customer: HttpTypes.StoreCustomer }) => (
  <div className="surface-panel" data-testid="account-email-editor">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#73766c]">
          Sign-in email
        </h2>
        <p className="break-all text-sm" data-testid="current-info">
          {customer.email}
        </p>
      </div>
      <span className="rounded-full bg-[#f0f2e9] px-3 py-1 text-xs text-[#626956]">
        Account email
      </span>
    </div>
    <p className="mt-4 text-xs leading-6 text-[#73766c]">
      Need help changing your sign-in details?{" "}
      <LocalizedClientLink href="/contact" className="text-link">
        Contact us
      </LocalizedClientLink>
      .
    </p>
  </div>
)
export default ProfileEmail
