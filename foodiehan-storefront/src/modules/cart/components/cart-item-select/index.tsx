"use client"
import { forwardRef, SelectHTMLAttributes } from "react"
import ChevronDown from "@modules/common/icons/chevron-down"
type NativeSelectProps = { placeholder?: string } & Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
>
const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Qty", className = "", children, ...props }, ref) => (
    <div className="relative inline-flex items-center">
      <select
        ref={ref}
        {...props}
        className={
          "h-10 min-w-[76px] appearance-none rounded-full border border-[#d8dccf] bg-white py-2 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#788468] disabled:opacity-50 " +
          className
        }
      >
        <option disabled value="">
          {placeholder}
        </option>
        {children}
      </select>
      <span className="pointer-events-none absolute right-3">
        <ChevronDown size={14} />
      </span>
    </div>
  )
)
CartItemSelect.displayName = "CartItemSelect"
export default CartItemSelect
