"use client"

import { useEffect, useState, ReactNode } from "react"

interface NavClientProps {
  children: ReactNode
}

export default function NavClient({ children }: NavClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Switch to solid background after scrolling past 80px
      setIsScrolled(window.scrollY > 80)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 transition-colors duration-500">
      <header
        className={`relative mx-auto transition-all duration-500 ${
          isScrolled
            ? "bg-white shadow-sm text-[var(--color-text-primary)]"
            : "bg-transparent text-white"
        }`}
      >
        {children}
      </header>
    </div>
  )
}
