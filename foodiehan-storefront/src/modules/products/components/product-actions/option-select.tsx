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
    <div className="flex flex-col gap-y-2.5 mb-6">
      <span className="text-xs font-normal text-[#1a1a1a] tracking-wide">
        {title}
      </span>
      <div className="flex flex-wrap gap-2.5" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const isSelected = v === current
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              disabled={disabled}
              className={`px-5 py-2 text-xs sm:text-[13px] font-normal transition-all duration-200 border rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed ${
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-[#1a1a1a] border-[#d0d0d0] hover:border-black"
              }`}
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
