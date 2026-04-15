"use client"

import { useEffect, useState, ReactNode } from "react"

interface NavClientProps {
  children: ReactNode
}

export default function NavClient({ children }: NavClientProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // 向下滚动 - 隐藏
        setIsVisible(false)
      } else {
        // 向上滚动 - 显示
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div className="sticky inset-x-0 top-0 z-50">
      <header
        className={`relative h-auto mx-auto transition-transform duration-300 bg-[var(--color-surface)] shadow-sm ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {children}
      </header>
    </div>
  )
}
