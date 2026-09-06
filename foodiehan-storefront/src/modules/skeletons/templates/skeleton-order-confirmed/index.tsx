export default function SkeletonOrderConfirmed() {
  return (
    <div
      className="page-shell"
      role="status"
      aria-label="Loading order confirmation"
    >
      <div className="mx-auto max-w-5xl">
        <div className="h-14 max-w-xl mx-auto rounded-xl animate-pulse mb-10" />
        <div className="grid small:grid-cols-[1fr_310px] gap-6">
          <div className="h-80 rounded-2xl animate-pulse" />
          <div className="h-60 rounded-2xl animate-pulse" />
        </div>
        <span className="sr-only">Loading your order…</span>
      </div>
    </div>
  )
}
