"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN)
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-[#e2e4dc] bg-white md:grid-cols-2">
      <div className="relative flex flex-col justify-between gap-10 bg-[#e8ebdf] p-8 small:p-12">
        <LocalizedClientLink
          href="/"
          className="text-xl font-semibold tracking-tight"
        >
          foodiehan<span className="text-[#7c886a]">.</span>
        </LocalizedClientLink>
        <div>
          <p className="eyebrow mb-5">Your everyday, made better</p>
          <h2 className="font-serif text-4xl leading-[1.15] tracking-tight small:text-5xl">
            Good things.
            <br />
            All in one place.
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-7 text-[#626956]">
            A space for your favourite finds, your latest orders, and everything
            that makes shopping a little easier.
          </p>
        </div>
        <ul className="grid gap-4 text-sm text-[#46523b]">
          {[
            "Keep track of every order",
            "Save your delivery addresses",
            "Enjoy a smoother checkout",
          ].map((benefit) => (
            <li key={benefit} className="flex items-center gap-3">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[#bac2ac] text-xs"
                aria-hidden="true"
              >
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center p-6 py-10 sm:p-10 small:p-12">
        {currentView === LOGIN_VIEW.SIGN_IN ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
