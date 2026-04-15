"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  showHoverUnderline = false,
  underlineColor = "currentColor",
  className = "",
  style,
  ...props
}: {
  children?: React.ReactNode
  href: string
  showHoverUnderline?: boolean
  underlineColor?: string
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  const { countryCode } = useParams()

  const linkClassName = showHoverUnderline
    ? `relative inline-block group ${className}`.trim()
    : className

  return (
    <Link
      href={`/${countryCode}${href}`}
      className={linkClassName}
      style={style}
      {...props}
    >
      {children}
      {showHoverUnderline && (
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 h-[1px] bottom-[-5px] origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 pointer-events-none"
          style={{
            display: "block",
            backgroundColor: underlineColor,
            transition: "transform .6s cubic-bezier(.58,.3,.005,1)",
          }}
        />
      )}
    </Link>
  )
}

export default LocalizedClientLink
