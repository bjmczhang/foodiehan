"use client"
import { forwardRef, SelectHTMLAttributes, useId } from "react"
export type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & SelectHTMLAttributes<HTMLSelectElement>
const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      placeholder = "Select…",
      className,
      children,
      errors,
      touched,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || generatedId
    return (
      <div className="w-full">
        <label htmlFor={selectId} className="store-label">
          {placeholder}
          {props.required && " *"}
        </label>
        <select
          {...props}
          id={selectId}
          aria-label={props["aria-label"] || placeholder}
          ref={ref}
          className={`store-input ${className || ""}`}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {children}
        </select>
      </div>
    )
  }
)
NativeSelect.displayName = "NativeSelect"
export default NativeSelect
