import Link from "next/link"
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="page-shell flex min-h-[70vh] flex-col items-center justify-center text-center"
    >
      <p className="eyebrow mb-5">404 · A little detour</p>
      <h1 className="page-title">This one’s gone missing.</h1>
      <p className="page-description mt-6 mb-8">
        We couldn’t find that page. There’s still something good waiting for you
        in the shop.
      </p>
      <Link href="/" className="button-primary">
        Back to FoodieHan <span aria-hidden="true">→</span>
      </Link>
    </main>
  )
}
