"use client"
import { useId, useRef, useState } from "react"
import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

const DiscountCode = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [removing, setRemoving] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const promotions = cart.promotions ?? []
  const removePromotionCode = async (code: string) => {
    setErrorMessage("")
    setRemoving(code)
    try {
      await applyPromotions(
        promotions
          .filter((promotion) => promotion.code && promotion.code !== code)
          .map((promotion) => promotion.code!)
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't remove this code. Please try again."
      )
    } finally {
      setRemoving(null)
    }
  }
  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")
    const code = formData.get("code")?.toString().trim()
    if (!code) {
      setErrorMessage("Enter a promotion code to continue.")
      return
    }
    const codes = Array.from(
      new Set([
        ...promotions
          .map((promotion) => promotion.code)
          .filter((value): value is string => !!value),
        code,
      ])
    )
    try {
      await applyPromotions(codes)
      if (inputRef.current) inputRef.current.value = ""
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't apply this code. Please try again."
      )
    }
  }
  return (
    <div className="text-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left text-[#323c2b]"
        aria-expanded={isOpen}
        aria-controls={inputId + "-form"}
        data-testid="add-discount-button"
      >
        <span>Have a promotion code?</span>
        <span className="text-lg font-light" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <form action={addPromotionCode} id={inputId + "-form"} className="mt-4">
          <label htmlFor={inputId} className="sr-only">
            Promotion code
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              className="h-11 min-w-0 flex-1 rounded-xl border border-[#d8dccf] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#788468]"
              id={inputId}
              name="code"
              type="text"
              placeholder="Enter your code"
              autoComplete="off"
              data-testid="discount-input"
            />
            <SubmitButton
              variant="secondary"
              data-testid="discount-apply-button"
            >
              Apply
            </SubmitButton>
          </div>
        </form>
      )}
      {promotions.length > 0 && (
        <div className="mt-4 space-y-2">
          {promotions.map((promotion) => {
            const method = promotion.application_method
            const amount =
              method?.type === "percentage"
                ? method.value + "%"
                : method?.currency_code && method.value !== undefined
                ? convertToLocale({
                    amount: +method.value,
                    currency_code: method.currency_code,
                  })
                : null
            return (
              <div
                key={promotion.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-[#eeefe7] px-3 py-2 text-xs"
                data-testid="discount-row"
              >
                <span className="min-w-0 truncate" data-testid="discount-code">
                  {promotion.code}
                  {amount && " · " + amount + " off"}
                  {promotion.is_automatic && " · Automatic"}
                </span>
                {!promotion.is_automatic && promotion.code && (
                  <button
                    type="button"
                    disabled={removing === promotion.code}
                    onClick={() => removePromotionCode(promotion.code!)}
                    className="shrink-0 px-1 py-1 text-[#73766c] hover:text-[#272b24] disabled:opacity-40"
                    aria-label={"Remove promotion " + promotion.code}
                    data-testid="remove-discount-button"
                  >
                    {removing === promotion.code ? "…" : "×"}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
      <ErrorMessage error={errorMessage} data-testid="discount-error-message" />
    </div>
  )
}
export default DiscountCode
