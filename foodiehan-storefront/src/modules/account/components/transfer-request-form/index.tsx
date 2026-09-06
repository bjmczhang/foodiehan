"use client"

import { useActionState, useEffect, useState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })
  useEffect(() => {
    if (state.success && state.order) setShowSuccess(true)
  }, [state.success, state.order])

  return (
    <section className="rounded-2xl border border-[#e2e4dc] bg-[#edf0e5] p-6">
      <p className="eyebrow mb-3">Missing an order?</p>
      <h2 className="font-serif text-2xl">Bring everything together.</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-[#73766c]">
        Placed an order as a guest? Enter the order ID from your confirmation
        email to request that it be added to your account.
      </p>
      <form
        action={formAction}
        className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
      >
        <div className="w-full sm:flex-1">
          <Input label="Order ID" name="order_id" required autoComplete="off" />
        </div>
        <SubmitButton
          variant="secondary"
          className="w-full shrink-0 !rounded-full !h-12 sm:w-auto"
        >
          Request transfer
        </SubmitButton>
      </form>
      {!state.success && state.error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {showSuccess && (
        <div
          role="status"
          className="mt-5 flex items-start justify-between gap-4 rounded-xl bg-white p-4"
        >
          <div>
            <p className="text-sm font-medium">Check your inbox.</p>
            <p className="mt-1 break-words text-xs leading-6 text-[#73766c]">
              A transfer request for {state.order?.id} was sent to{" "}
              {state.order?.email}. Follow the link in the email to confirm.
            </p>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[#f0f2e9]"
            onClick={() => setShowSuccess(false)}
            aria-label="Dismiss transfer confirmation"
          >
            ×
          </button>
        </div>
      )}
    </section>
  )
}
