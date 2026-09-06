export default function Loading() {
  return (
    <div
      className="page-shell animate-pulse"
      role="status"
      aria-label="Loading your cart"
    >
      <div className="mb-4 h-3 w-32 rounded-full bg-[#e2e4dc]" />
      <div className="mb-10 h-14 w-64 rounded-xl bg-[#e2e4dc]" />
      <div className="grid gap-8 large:grid-cols-[minmax(0,1fr)_370px]">
        <div className="surface-panel space-y-8">
          {[1, 2].map((item) => (
            <div key={item} className="flex gap-5">
              <div className="h-28 w-28 rounded-xl bg-[#eeefe7]" />
              <div className="flex-1 space-y-4">
                <div className="h-4 w-2/3 rounded bg-[#eeefe7]" />
                <div className="h-3 w-1/3 rounded bg-[#eeefe7]" />
                <div className="h-9 w-20 rounded-full bg-[#eeefe7]" />
              </div>
            </div>
          ))}
        </div>
        <div className="surface-panel h-80 space-y-7">
          <div className="h-7 w-40 rounded bg-[#eeefe7]" />
          <div className="h-24 rounded-xl bg-[#eeefe7]" />
          <div className="h-12 rounded-full bg-[#eeefe7]" />
        </div>
      </div>
      <span className="sr-only">Loading your cart…</span>
    </div>
  )
}
