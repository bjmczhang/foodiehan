"use client"
import { useState, useTransition } from "react"
import { useParams, usePathname } from "next/navigation"
import { StateType } from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import { updateRegion } from "@lib/data/cart"
export default function CountrySelect({
  regions,
}: {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}) {
  const { countryCode } = useParams()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const countries = regions
    .flatMap((region) => region.countries || [])
    .filter((country) => country.iso_2)
    .sort((a, b) => (a.display_name || "").localeCompare(b.display_name || ""))
  return (
    <div>
      <label htmlFor="shipping-region" className="store-label">
        Shopping region
      </label>
      <select
        id="shipping-region"
        className="store-input"
        value={countryCode as string}
        disabled={pending}
        onChange={(e) => {
          const country = e.target.value
          setError("")
          startTransition(async () => {
            try {
              await updateRegion(
                country,
                pathname.split(`/${countryCode}`)[1] || "/"
              )
            } catch {
              setError("We couldn’t update your region. Please try again.")
            }
          })
        }}
      >
        {countries.map((country) => (
          <option key={country.iso_2} value={country.iso_2}>
            {country.display_name || country.name}
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
