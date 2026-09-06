import { HttpTypes } from "@medusajs/types"
type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}
export default function OptionSelect({
  option,
  current,
  updateOption,
  title,
  disabled,
  "data-testid": dataTestId,
}: OptionSelectProps) {
  const values = Array.from(
    new Set((option.values || []).map((value) => value.value))
  )
  return (
    <fieldset className="mb-6" disabled={disabled}>
      <legend className="text-sm text-[#272b24] mb-3">
        {title}
        <span className="text-[#73766c] ml-2">
          {current ? `— ${current}` : "— Please select"}
        </span>
      </legend>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {values.map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => updateOption(option.id, value)}
            aria-pressed={value === current}
            disabled={disabled}
            className={`px-5 py-2.5 text-sm border rounded-full transition-colors disabled:opacity-40 ${
              value === current
                ? "bg-[#323c2b] text-white border-[#323c2b]"
                : "bg-white text-[#272b24] border-[#e2e4dc] hover:border-[#323c2b]"
            }`}
            data-testid="option-button"
          >
            {value}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
