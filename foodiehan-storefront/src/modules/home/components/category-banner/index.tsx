import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    subtitle: "Freshly Baked",
    title: "Artisan Breads",
    image: "/images/category-bread.jpeg",
    href: "/categories/artisan-breads",
  },
  {
    subtitle: "Sweet Treats",
    title: "Pastries & Cakes",
    image: "/images/category-niangao.jpeg",
    href: "/categories/pastries",
  },
  {
    subtitle: "Morning Favourites",
    title: "Croissants",
    image: "/images/category-kimchi.jpeg",
    href: "/categories/croissants",
  },
  {
    subtitle: "Asian Delights",
    title: "Asian Buns",
    image: "/images/category-gimbap.jpeg",
    href: "/categories/asian-buns",
  },
]

export default function CategoryBanner() {
  return (
    <section className="py-12 small:py-24 content-container">
      <div className="grid grid-cols-2 gap-6 small:grid-cols-4">
        {categories.map((cat) => (
          <LocalizedClientLink key={cat.title} href={cat.href}>
            <div className="relative overflow-hidden rounded cursor-pointer group aspect-square ">
              {/* Image — scales on hover, clipped by parent overflow-hidden */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />

              {/* 40% black overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Centered text content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-center text-white">
                <p className="text-xs font-light tracking-widest opacity-90">
                  {cat.subtitle}
                </p>
                <h3
                  className="text-3xl font-medium leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {cat.title}
                </h3>
                <button className="inline-block px-6 py-3 text-xs tracking-wider uppercase bg-[var(--color-brand)] text-white rounded-full mt-4 hover:bg-[var(--color-brand-hover)] transition-colors duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
