"use client"
import React, { useId, useImperativeHandle, useState } from "react"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      touched,
      errors,
      required,
      topLabel,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const generatedId = useId()
    const inputId = id || generatedId
    const [showPassword, setShowPassword] = useState(false)
    useImperativeHandle(ref, () => inputRef.current!)
    return (
      <div className="flex flex-col w-full">
        <label htmlFor={inputId} className="store-label">
          {topLabel || label}
          {required && <span className="ml-1 text-[#73766c]">*</span>}
        </label>
        <div className="relative">
          <input
            {...props}
            id={inputId}
            type={type === "password" && showPassword ? "text" : type}
            name={name}
            required={required}
            className={`store-input ${type === "password" ? "!pr-12" : ""} ${
              className || ""
            }`}
            ref={inputRef}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-1 top-1 icon-button text-[#73766c]"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"
export default Input
