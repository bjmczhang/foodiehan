import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span
        className="text-xs font-medium uppercase tracking-[0.1em]"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </span>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const isSelected = v === current
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              disabled={disabled}
              className="px-5 py-2.5 text-sm font-normal transition-all duration-200 border rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                color: isSelected ? "#fff" : "var(--color-text-primary)",
                backgroundColor: isSelected ? "var(--color-text-primary)" : "transparent",
                borderColor: isSelected ? "var(--color-text-primary)" : "var(--color-surface-off)",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "var(--color-text-primary)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "var(--color-surface-off)"
                }
              }}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
