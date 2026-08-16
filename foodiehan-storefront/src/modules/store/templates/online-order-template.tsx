"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useRef, useState } from "react"
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
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.handle ?? ""
  )

  const groupedProducts = groupProductsByCategory(products, categories)

  // Scroll spy to update active category tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160
      for (const cat of categories) {
        const el = sectionRefs.current.get(cat.handle)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(cat.handle)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [categories])

  // Scroll to a category section if URL hash matches on mount
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "")
    if (!hash) return
    setActiveCategory(hash)
    const timer = setTimeout(() => {
      const el = sectionRefs.current.get(hash)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 130
        window.scrollTo({ top, behavior: "smooth" })
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const scrollToCategory = (handle: string) => {
    setActiveCategory(handle)
    const el = sectionRefs.current.get(handle)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 130
      window.scrollTo({ top, behavior: "smooth" })
      window.history.replaceState(null, "", `#${handle}`)
    }
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* ── Sub-navigation / Category Filter Bar (Sticky) ────────── */}
      {categories.length > 0 && (
        <nav className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-[#f0f0f0] transition-all">
          <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-center overflow-x-auto no-scrollbar gap-x-6 sm:gap-x-10 py-4">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.handle
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.handle)}
                  className={`flex-shrink-0 text-xs tracking-[0.18em] uppercase transition-all duration-200 py-1 relative ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-[#666666] hover:text-black font-normal"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  {cat.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black transition-all" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {/* ── Category sections ─────────────────────────────── */}
      <div className="pt-8 pb-28 max-w-[1440px] mx-auto px-6 sm:px-12">
        {categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-[#888888]">
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
              className="mb-24 sm:mb-32 scroll-mt-36"
            >
              {/* Centered Category Heading matching Image 1 */}
              <h2
                className="text-3xl sm:text-4xl font-normal text-center tracking-wide text-[#1a1a1a] mb-12 sm:mb-16"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {cat.name}
              </h2>

              {/* Product grid matching Image 1 */}
              {catProducts.length === 0 ? (
                <p className="text-center text-sm text-[#888888] py-8">
                  No products in this category yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-x-10 gap-y-12 sm:gap-y-16">
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
  )
}

