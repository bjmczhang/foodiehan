import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[65vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-5">404 · A little detour</p>
      <h1 className="page-title">This one’s gone missing.</h1>
      <p className="page-description mt-6 mb-8">
        That page or product is no longer here. Let’s find you something good.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <LocalizedClientLink href="/store" className="button-primary">
          Explore the shop →
        </LocalizedClientLink>
        <LocalizedClientLink href="/" className="button-secondary">
          Back home
        </LocalizedClientLink>
      </div>
    </div>
  )
}
