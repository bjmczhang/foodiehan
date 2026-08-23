"use client"

import { useEffect, useState, ReactNode } from "react"
import { usePathname } from "next/navigation"

interface NavClientProps {
  children: ReactNode
}

export default function NavClient({ children }: NavClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Check if current route is homepage: "/", "/au", "/au/", etc.
  const isHomePage = !pathname || pathname === "/" || /^\/[a-z]{2}\/?$/i.test(pathname)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isSolid = !isHomePage || isScrolled

  return (
    <div className="fixed inset-x-0 top-0 z-50 transition-colors duration-300">
      <header
        className={`relative mx-auto transition-all duration-300 group/nav ${
          isSolid
            ? "bg-white text-[#1a1a1a] border-b border-[#ededed] shadow-[0_1px_3px_rgba(0,0,0,0.03)] is-solid"
            : "bg-transparent text-white is-transparent"
        }`}
      >
        {children}
      </header>
    </div>
  )
}

