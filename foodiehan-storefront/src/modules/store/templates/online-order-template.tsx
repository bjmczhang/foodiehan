"use client"

import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
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
  const { countryCode } = useParams()
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map())

  const groupedProducts = groupProductsByCategory(products, categories)

  // Scroll to a category section if URL hash matches on mount
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "")
    if (!hash) return
    // Small delay so the DOM has laid out
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
      <div style={{ padding: "40px 40px 0" }}>
        <div className="content-container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumbs" style={{ marginBottom: 12 }}>
            <ol
              className="flex items-center gap-x-2"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              <li>
                <a
                  href={`/${countryCode}`}
                  style={{
                    fontSize: 12,
                    color: "#666666",
                    textDecoration: "none",
                  }}
                  className="hover:text-[var(--color-brand)] transition-colors"
                >
                  Home
                </a>
              </li>
              <li style={{ fontSize: 12, color: "#aaaaaa" }}>/</li>
              <li>
                <span
                  style={{ fontSize: 12, color: "#333333", fontWeight: 600 }}
                >
                  Full Menu
                </span>
              </li>
            </ol>
          </nav>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
              margin: "0 0 28px",
            }}
          >
            Full Menu
          </h1>
        </div>
      </div>

      {/* ── Anchor navigation bar (sticky) ────────────────── */}
      {categories.length > 0 && (
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#ffffff",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div
            className="content-container flex items-center gap-x-2 overflow-x-auto no-scrollbar"
            style={{
              paddingTop: 14,
              paddingBottom: 14,
            }}
          >
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.handle}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = sectionRefs.current.get(cat.handle)
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" })
                    // Update URL hash without scrolling
                    window.history.replaceState(null, "", `#${cat.handle}`)
                  }
                }}
                style={{
                  display: "inline-block",
                  padding: "6px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#333333",
                  textDecoration: "none",
                  border: "1px solid #cccccc",
                  borderRadius: 9999,
                  whiteSpace: "nowrap",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                className="hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* ── Category sections ─────────────────────────────── */}
      <div style={{ padding: "40px 40px 80px" }}>
        <div className="content-container">
          {categories.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-24"
              style={{ color: "#8d8d8d", fontSize: 16, textAlign: "center" }}
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
                style={{ marginBottom: 64 }}
              >
                {/* Section heading */}
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: 24,
                    paddingBottom: 10,
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  {cat.name}
                </h2>

                {/* Product grid */}
                {catProducts.length === 0 ? (
                  <p style={{ fontSize: 14, color: "#999999", padding: "20px 0" }}>
                    No products in this category yet.
                  </p>
                ) : (
                  <div
                    className="grid gap-x-6 gap-y-10"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(220px, 1fr))",
                    }}
                  >
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
