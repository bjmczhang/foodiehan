import { Button } from "@medusajs/ui"
import { useEffect, useId } from "react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "We couldn’t save your changes. Please try again.",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()
  const editorId = useId()
  useEffect(() => {
    if (isSuccess) close()
  }, [isSuccess, close])

  return (
    <div className="surface-panel text-sm" data-testid={dataTestid}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#73766c]">
            {label}
          </h2>
          <div className="break-words leading-6">
            {typeof currentInfo === "string" ? (
              <span data-testid="current-info">{currentInfo}</span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          className="shrink-0 !rounded-full !px-5"
          onClick={() => {
            clearState()
            toggle()
          }}
          type={state ? "reset" : "button"}
          data-testid="edit-button"
          data-active={state}
          aria-expanded={state}
          aria-controls={editorId}
        >
          {state ? "Cancel" : "Edit"}
        </Button>
      </div>
      {isSuccess && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-[#edf3e6] px-4 py-3 text-[#445a31]"
          data-testid="success-message"
        >
          {label} updated successfully.
        </p>
      )}
      {isError && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700"
          data-testid="error-message"
        >
          {errorMessage}
        </p>
      )}
      {state && (
        <div id={editorId} className="mt-5 border-t border-[#e2e4dc] pt-5">
          <div>{children}</div>
          <div className="mt-5 flex justify-end">
            <Button
              isLoading={pending}
              className="w-full !rounded-full sm:w-auto"
              type="submit"
              data-testid="save-button"
            >
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountInfo
