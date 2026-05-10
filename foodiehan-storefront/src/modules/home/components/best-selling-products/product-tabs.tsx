"use client"

import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { useState } from "react"
import OrderProductCard from "@modules/store/components/order-product-card"

type TabId = "best-sellers" | "new-arrivals" | "hot-items"

const tabs: { id: TabId; label: string }[] = [
  { id: "best-sellers", label: "Best sellers" },
  { id: "new-arrivals", label: "New arrivals" },
  { id: "hot-items", label: "Hot items" },
]

type ProductTabsProps = {
  bestSellers: HttpTypes.StoreProduct[]
  newArrivals: HttpTypes.StoreProduct[]
  hotItems: HttpTypes.StoreProduct[]
  regionId: string
}

export default function ProductTabs({
  bestSellers,
  newArrivals,
  hotItems,
  regionId,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("best-sellers")
  const { countryCode } = useParams()

  const productMap: Record<TabId, HttpTypes.StoreProduct[]> = {
    "best-sellers": bestSellers,
    "new-arrivals": newArrivals,
    "hot-items": hotItems,
  }

  const products = productMap[activeTab].slice(0, 8)

  if (!products.length) {
    return (
      <div className="py-12 content-container small:py-24">
        <div className="flex items-center justify-center gap-x-8 sm:gap-x-12 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-3 text-lg sm:text-xl font-semibold transition-colors duration-200"
              style={{
                color: activeTab === tab.id ? "var(--color-text-primary)" : "#999999",
                borderBottom: activeTab === tab.id ? "2px solid var(--color-brand)" : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-center py-16" style={{ color: "#999999", fontSize: 15 }}>
          No products yet.
        </p>
      </div>
    )
  }

  return (
    <div className="py-12 content-container small:py-24">
      {/* ── Tabs ── */}
      <div className="flex items-center justify-center gap-x-8 sm:gap-x-12 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative pb-3 text-lg sm:text-xl font-semibold transition-colors duration-200"
            style={{
              color: activeTab === tab.id ? "var(--color-text-primary)" : "#999999",
              borderBottom: activeTab === tab.id ? "2px solid var(--color-brand)" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Product grid (4 cols × 2 rows) ── */}
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 small:gap-y-12">
        {products.map((product) => (
          <li key={product.id}>
            <OrderProductCard product={product} regionId={regionId} />
          </li>
        ))}
      </ul>

      {/* ── View All button ── */}
      <div className="flex justify-center mt-10">
        <a
          href={`/${countryCode}/online-order`}
          className="inline-flex items-center justify-center px-9 py-5 border-2 border-[var(--color-border-dark)] bg-[var(--color-border-dark)] text-white uppercase tracking-wider hover:bg-transparent hover:text-[var(--color-border-dark)] transition duration-300 ease-in-out"
        >
          View All
        </a>
      </div>
    </div>
  )
}
