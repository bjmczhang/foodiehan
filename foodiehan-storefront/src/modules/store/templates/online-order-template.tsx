"use client"

import { HttpTypes } from "@medusajs/types"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import OrderProductCard from "@modules/store/components/order-product-card"

type Category = {
  id: string
  name: string
  handle: string
}

type SortOption = "title-asc" | "title-desc" | "price-asc" | "price-desc" | "default"

type OnlineOrderTemplateProps = {
  categories: Category[]
  products: HttpTypes.StoreProduct[]
  regionId: string
  activeCategoryHandle: string | null
}

function sortProducts(
  products: HttpTypes.StoreProduct[],
  sort: SortOption
): HttpTypes.StoreProduct[] {
  const list = [...products]
  switch (sort) {
    case "title-asc":
      return list.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""))
    case "title-desc":
      return list.sort((a, b) => (b.title ?? "").localeCompare(a.title ?? ""))
    case "price-asc":
      return list.sort((a, b) => {
        const pa = (a.variants?.[0] as any)?.calculated_price?.calculated_amount ?? 0
        const pb = (b.variants?.[0] as any)?.calculated_price?.calculated_amount ?? 0
        return pa - pb
      })
    case "price-desc":
      return list.sort((a, b) => {
        const pa = (a.variants?.[0] as any)?.calculated_price?.calculated_amount ?? 0
        const pb = (b.variants?.[0] as any)?.calculated_price?.calculated_amount ?? 0
        return pb - pa
      })
    default:
      return list
  }
}

export default function OnlineOrderTemplate({
  categories,
  products,
  regionId,
  activeCategoryHandle,
}: OnlineOrderTemplateProps) {
  const router = useRouter()
  const { countryCode } = useParams()
  const [sort, setSort] = useState<SortOption>("default")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeCategory = categories.find((c) => c.handle === activeCategoryHandle)
  const sortedProducts = sortProducts(products, sort)

  function handleCategoryClick(handle: string | null) {
    const base = `/${countryCode}/online-order`
    router.push(handle ? `${base}?category=${handle}` : base)
    setSidebarOpen(false)
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>

      {/* ── Collection hero (light, like ChaTime) ─────────── */}
      <div
        style={{
          background: "#f5f8f2",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "28px 40px 24px",
        }}
      >
        <div className="py-12 small:py-24 content-container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumbs" style={{ marginBottom: 10 }}>
            <ol className="flex items-center gap-x-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <a
                  href={`/${countryCode}`}
                  style={{ fontSize: 12, color: "#666666", textDecoration: "none" }}
                  className="hover:text-[var(--color-brand)] transition-colors"
                >
                  Home
                </a>
              </li>
              <li style={{ fontSize: 12, color: "#aaaaaa" }}>/</li>
              <li>
                <span style={{ fontSize: 12, color: "#333333", fontWeight: 600 }}>
                  Online Order
                </span>
              </li>
              {activeCategory && (
                <>
                  <li style={{ fontSize: 12, color: "#aaaaaa" }}>/</li>
                  <li>
                    <span style={{ fontSize: 12, color: "#333333", fontWeight: 600 }}>
                      {activeCategory.name}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {activeCategory ? activeCategory.name : "Online Order"}
          </h1>
        </div>
      </div>

      {/* ── Sort toolbar ──────────────────────────────────── */}
      <div
        className="border-b"
        style={{ background: "#ffffff", borderColor: "#e5e5e5" }}
      >
        <div
          className="flex items-center justify-between content-container"
          style={{
            height: 52,
          }}
        >
          {/* Mobile: Filter toggle */}
          <button
            className="flex items-center gap-x-2 md:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#333333",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0 0",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <line x1="16.5" y1="6.5" x2="3.5" y2="6.5" stroke="currentColor" strokeLinecap="round" />
              <line x1="16.5" y1="13.5" x2="3.5" y2="13.5" stroke="currentColor" strokeLinecap="round" />
              <circle cx="7" cy="6.5" r="2" fill="white" stroke="currentColor" />
              <circle cx="13" cy="13.5" r="2" fill="white" stroke="currentColor" />
            </svg>
            Filter
          </button>

          {/* Product count */}
          <span
            style={{
              fontSize: 13,
              color: "#666666",
              fontWeight: 400,
            }}
          >
            {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
          </span>

          {/* Sort by */}
          <div className="flex items-center gap-x-2">
            <label
              htmlFor="sort-by"
              style={{ fontSize: 12, fontWeight: 600, color: "#666666", letterSpacing: "0.06em" }}
            >
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-by"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                style={{
                  fontSize: 13,
                  color: "#333333",
                  border: "1px solid #cccccc",
                  borderRadius: 0,
                  padding: "6px 28px 6px 10px",
                  background: "#ffffff",
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="default">Featured</option>
                <option value="title-asc">Alphabetically, A–Z</option>
                <option value="title-desc">Alphabetically, Z–A</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
              <svg
                aria-hidden="true"
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                viewBox="0 0 10 6"
                width="10"
                height="6"
                fill="currentColor"
                style={{ color: "#666666" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content: sidebar + grid ──────────────────── */}
      <div
        className="flex gap-8 py-12 small:py-24 content-container"
        style={{
          alignItems: "flex-start",
        }}
      >

        {/* ── Left sidebar (desktop) ─────────────────────── */}
        {categories.length > 0 && (
          <aside
            className="hidden md:block shrink-0"
            style={{ width: 220, position: "sticky", top: 80 }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#333333",
                marginBottom: 12,
                paddingBottom: 10,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              Categories
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {/* All */}
              <li>
                <button
                  onClick={() => handleCategoryClick(null)}
                  className="w-full text-left transition-colors duration-150"
                  style={{
                    display: "block",
                    padding: "8px 0",
                    fontSize: 13,
                    fontWeight: activeCategoryHandle === null ? 600 : 400,
                    color: activeCategoryHandle === null ? "var(--color-brand)" : "#333333",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  All Products
                </button>
              </li>

              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.handle)}
                    className="w-full text-left transition-colors duration-150"
                    style={{
                      display: "block",
                      padding: "8px 0",
                      fontSize: 13,
                      fontWeight: activeCategoryHandle === cat.handle ? 600 : 400,
                      color:
                        activeCategoryHandle === cat.handle
                          ? "var(--color-brand)"
                          : "#333333",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* ── Mobile drawer overlay ──────────────────────── */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="fixed left-0 top-0 bottom-0 z-50 overflow-y-auto"
              style={{ width: 280, background: "#ffffff", padding: "24px 20px" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#333333",
                  }}
                >
                  Filter
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#333333",
                  }}
                  aria-label="Close filter"
                >
                  <svg viewBox="0 0 18 17" width="18" height="17" fill="none">
                    <path
                      d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li>
                  <button
                    onClick={() => handleCategoryClick(null)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 0",
                      fontSize: 14,
                      fontWeight: activeCategoryHandle === null ? 700 : 400,
                      color: activeCategoryHandle === null ? "var(--color-brand)" : "#333333",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #eeeeee",
                      cursor: "pointer",
                    }}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.handle)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 0",
                        fontSize: 14,
                        fontWeight: activeCategoryHandle === cat.handle ? 700 : 400,
                        color:
                          activeCategoryHandle === cat.handle
                            ? "var(--color-brand)"
                            : "#333333",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid #eeeeee",
                        cursor: "pointer",
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ── Product grid ──────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {sortedProducts.length === 0 ? (
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
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                <path d="M16 32c2-4 10-4 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="18" cy="20" r="2" fill="currentColor" />
                <circle cx="30" cy="20" r="2" fill="currentColor" />
              </svg>
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {sortedProducts.map((product) => (
                <OrderProductCard
                  key={product.id}
                  product={product}
                  regionId={regionId}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
