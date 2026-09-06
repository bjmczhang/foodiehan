export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading account details"
      className="space-y-6"
    >
      <div className="h-12 w-2/3 rounded bg-[#e7e9df] animate-pulse" />
      {[0, 1, 2].map((n) => (
        <div key={n} className="h-32 rounded-2xl bg-[#eeeee7] animate-pulse" />
      ))}
      <span className="sr-only">Loading account details…</span>
    </div>
  )
}
