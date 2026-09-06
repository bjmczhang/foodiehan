"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { StateType } from "@lib/hooks/use-toggle-state"
import { Locale } from "@lib/data/locales"
import { updateLocale } from "@lib/data/locale-actions"
export default function LanguageSelect({
  locales,
  currentLocale,
}: {
  toggleState: StateType
  locales: Locale[]
  currentLocale: string | null
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()
  return (
    <div>
      <label htmlFor="store-language" className="store-label">
        Language
      </label>
      <select
        id="store-language"
        className="store-input"
        value={currentLocale || ""}
        disabled={pending}
        onChange={(e) => {
          const value = e.target.value
          setError("")
          startTransition(async () => {
            try {
              await updateLocale(value)
              router.refresh()
            } catch {
              setError("We couldn’t update your language. Please try again.")
            }
          })
        }}
      >
        <option value="">Default</option>
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.name}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="text-xs text-rose-700 mt-2">
          {error}
        </p>
      )}
    </div>
  )
}
