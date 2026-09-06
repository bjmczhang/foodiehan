export default function Loading() {
  return (
    <div role="status" aria-label="Loading your account" className="page-shell">
      <div className="h-5 w-28 rounded bg-[#e7e9df] animate-pulse mb-6" />
      <div className="h-12 w-2/3 max-w-md rounded bg-[#e7e9df] animate-pulse mb-10" />
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="h-48 rounded-2xl bg-[#eeeee7] animate-pulse" />
        <div className="h-48 rounded-2xl bg-[#eeeee7] animate-pulse" />
      </div>
      <span className="sr-only">Loading your account…</span>
    </div>
  )
}
