import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ProfilePassword = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer
}) => (
  <div className="surface-panel" data-testid="account-password-editor">
    <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#73766c]">
      Account security
    </h2>
    <p className="text-sm">Your password is kept private.</p>
    <p className="mt-3 text-xs leading-6 text-[#73766c]">
      For help accessing the account associated with {customer.email},{" "}
      <LocalizedClientLink href="/contact" className="text-link">
        get in touch
      </LocalizedClientLink>
      .
    </p>
  </div>
)
export default ProfilePassword
