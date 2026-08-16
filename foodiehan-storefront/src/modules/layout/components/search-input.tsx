"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import { MagnifyingGlass, XMark } from "@medusajs/icons"

export default function SearchInput() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { countryCode } = useParams()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (!query.trim()) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [query])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const prefix = countryCode ? `/${countryCode}` : ""
    router.push(`${prefix}/search?q=${encodeURIComponent(trimmed)}`)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      {isOpen ? (
        <form
          onSubmit={onSubmit}
          className="flex items-center bg-white border-b border-black py-1 px-1 transition-all duration-300 ease-out"
          style={{ width: 220 }}
        >
          <MagnifyingGlass className="w-4 h-4 text-[#222222] mr-2 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs text-[#222222] placeholder:text-[#999999] bg-transparent outline-none tracking-wider font-light"
          />
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
            className="p-1 text-[#666666] hover:text-black transition-colors"
            aria-label="Close search"
          >
            <XMark className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 transition-colors duration-200 hover:text-[var(--color-brand)] focus:outline-none"
          aria-label="Open search"
        >
          <MagnifyingGlass className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

