"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlass } from "@medusajs/icons"

export default function SearchInput() {
  const [q, setQ] = useState("")
  const router = useRouter()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = q.trim()
    if (!trimmed) return
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <input
        aria-label="Search products"
        placeholder="SEARCH"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] bg-transparent border-b border-[var(--color-border)] px-3 py-2 w-48 transition-colors duration-200 focus:outline-none"
      />
    </form>
  )
}
