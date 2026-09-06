import LocalizedClientLink from "@modules/common/components/localized-client-link"
const SignInPrompt = () => (
  <div className="flex flex-col gap-4 rounded-2xl bg-[#eeefe7] p-6 small:flex-row small:items-center small:justify-between">
    <div>
      <h2 className="text-sm font-medium">Make yourself at home.</h2>
      <p className="mt-1 text-sm leading-6 text-[#73766c]">
        Sign in to use saved addresses and keep track of your orders.
      </p>
    </div>
    <LocalizedClientLink
      href="/account"
      className="button-secondary shrink-0 self-start"
      data-testid="sign-in-button"
    >
      Sign in
    </LocalizedClientLink>
  </div>
)
export default SignInPrompt
