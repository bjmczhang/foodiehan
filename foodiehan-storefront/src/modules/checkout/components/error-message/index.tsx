const ErrorMessage = ({
  error,
  "data-testid": dataTestId,
}: {
  error?: string | null
  "data-testid"?: string
}) => {
  if (!error) return null
  return (
    <div
      role="alert"
      className="mt-3 rounded-lg border border-[#ebd5cc] bg-[#fcf3ef] px-3 py-2 text-sm leading-6 text-[#934c37]"
      data-testid={dataTestId}
    >
      {error}
    </div>
  )
}
export default ErrorMessage
