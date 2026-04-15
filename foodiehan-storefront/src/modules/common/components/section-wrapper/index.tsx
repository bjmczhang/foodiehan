import React from "react"

type SectionWrapperProps = {
  id?: string
  children?: React.ReactNode
  as?: React.ElementType
  size?: "page" | "content"
  className?: string
  containerClassName?: string
  padded?: boolean
  narrow?: boolean
  bgClass?: string
  rootRef?: React.Ref<HTMLDivElement>
}

export default function SectionWrapper({
  id,
  children,
  as: Component = "section",
  size,
  className = "",
  containerClassName = "max-w-[1100px] mx-auto",
  padded = true,
  narrow = false,
  bgClass = "",
  rootRef,
}: SectionWrapperProps) {
  const padding = padded ? "py-12 small:py-24" : ""
  const contentClass = size
    ? size === "content"
      ? "max-w-[800px] mx-auto"
      : "max-w-[1100px] mx-auto"
    : narrow
    ? "max-w-[800px] mx-auto"
    : containerClassName

  return (
    <Component
      ref={rootRef as any}
      id={id}
      className={`${padding} ${bgClass} ${className}`.trim()}
    >
      <div className={contentClass}>{children}</div>
    </Component>
  )
}
