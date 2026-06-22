"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useRef } from "react"
import MenuProductCard from "@modules/store/components/menu-product-card"

type Category = {
  id: string
  name: string
  handle: string
}

type OnlineOrderTemplateProps = {
  categories: Category[]
  products: HttpTypes.StoreProduct[]
}

/** Group products by the first top-level category they belong to. */
function groupProductsByCategory(
  products: HttpTypes.StoreProduct[],
  categories: Category[]
): Map<string, HttpTypes.StoreProduct[]> {
  const map = new Map<string, HttpTypes.StoreProduct[]>()

  for (const cat of categories) {
    map.set(cat.id, [])
  }

  for (const product of products) {
    const productCats = (product as any).categories ?? []
    const matched = productCats.find((pc: any) =>
      categories.some((c) => c.id === pc.id)
    )
    const targetId = matched?.id ?? categories[0]?.id
    if (targetId) {
      map.get(targetId)?.push(product)
    }
  }

  return map
}

export default function OnlineOrderTemplate({
  categories,
  products,
}: OnlineOrderTemplateProps) {
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map())

  const groupedProducts = groupProductsByCategory(products, categories)

  // Scroll to a category section if URL hash matches on mount
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "")
    if (!hash) return
    const timer = setTimeout(() => {
      const el = sectionRefs.current.get(hash)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* ── Page header ───────────────────────────────────── */}
      <div className="py-16 small:py-20">
        <h1
          className="text-4xl font-light tracking-wide text-center small:text-5xl"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "var(--color-text-primary)",
          }}
        >
          Full Menu
        </h1>
      </div>

      {/* ── Anchor navigation bar (sticky) ────────────────── */}
      {categories.length > 0 && (
        <nav
          className="sticky top-[72px] z-10 bg-white border-b border-[var(--color-surface-off)]"
        >
          <div
            className="flex items-center gap-x-8 overflow-x-auto no-scrollbar max-w-[1200px] mx-auto px-6"
            style={{ paddingTop: 14, paddingBottom: 14 }}
          >
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.handle}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = sectionRefs.current.get(cat.handle)
                  if (el) {
                    // Account for sticky header + nav height
                    const top = el.getBoundingClientRect().top + window.scrollY - 140
                    window.scrollTo({ top, behavior: "smooth" })
                    window.history.replaceState(null, "", `#${cat.handle}`)
                  }
                }}
                className="flex-shrink-0 text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-200 hover:text-[var(--color-brand)]"
                style={{
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                }}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* ── Category sections ─────────────────────────────── */}
      <div className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          {categories.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-24"
              style={{ color: "var(--color-text-muted)", fontSize: 16, textAlign: "center" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
                style={{ marginBottom: 16, opacity: 0.3 }}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 32c2-4 10-4 12 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="18" cy="20" r="2" fill="currentColor" />
                <circle cx="30" cy="20" r="2" fill="currentColor" />
              </svg>
              <p>No categories found.</p>
            </div>
          )}

          {categories.map((cat) => {
            const catProducts = groupedProducts.get(cat.id) ?? []

            return (
              <section
                key={cat.id}
                id={cat.handle}
                ref={(el) => {
                  sectionRefs.current.set(cat.handle, el)
                }}
                style={{ marginBottom: 72 }}
              >
                {/* Section heading */}
                <h2
                  className="mb-10 text-3xl font-light tracking-wide"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {cat.name}
                </h2>

                {/* Product grid */}
                {catProducts.length === 0 ? (
                  <p style={{ fontSize: 14, color: "var(--color-text-muted)", padding: "20px 0" }}>
                    No products in this category yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-5 gap-y-10">
                    {catProducts.map((product) => (
                      <MenuProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
