"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="flex flex-col w-full" data-testid="register-page">
      <p className="eyebrow mb-3">A little more connected</p>
      <h1 className="mb-4 font-serif text-4xl tracking-tight">
        Make yourself at home.
      </h1>
      <p className="mb-7 text-sm leading-6 text-[#73766c]">
        Create an account for easy checkout and all your orders in one place.
      </p>
      <form className="flex flex-col w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="mt-5 text-xs leading-6 text-[#73766c]">
          Your account keeps your order history and delivery details together
          for your next visit.
        </span>
        <SubmitButton
          className="w-full mt-5 !h-12 !rounded-full"
          data-testid="register-button"
        >
          Create account
        </SubmitButton>
      </form>
      <span className="mt-6 text-center text-[#73766c] text-sm">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-link"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
