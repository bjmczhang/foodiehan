const STATIC_PRODUCT_MAP: Record<string, string> = {
  "korean-kimchi": "/images/products/kimchi/korean-kimchi.webp",
  "pizza-slice": "/images/products/breads/pizza-slice.webp",
  "french-almond-cake": "/images/products/breads/french-almond-cake.webp",
  "sweet-potato-ball": "/images/products/breads/sweet-potato-ball.webp",
  "red-bean-bun": "/images/products/buns/red-bean-bun.webp",
  bomboloni: "/images/products/breads/bomboloni.webp",
  "salted-butter-bun": "/images/products/breads/salted-butter-bun.webp",
  "salted-butter-bun2": "/images/products/breads/salted-butter-bun2.webp",
  "peanut-crust-bun": "/images/products/buns/peanut-crust-bun.webp",
  "sticky-rice-sticks": "/images/products/buns/sticky-rice-sticks.webp",
  "purple-sweet-patato-bun":
    "/images/products/buns/purple-sweet-patato-bun.webp",
  "salted-red-bean-butter-bun":
    "/images/products/buns/salted-red-bean-butter-bun.webp",
  "sticky-rice-doughnut":
    "/images/products/pastries/sticky-rice-doughnut.webp",
}

/**
 * Sanitizes image URLs to prevent broken images from localhost backend URLs
 * or unconfigured local hosts in production.
 */
export function sanitizeImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined

  // If it's a localhost:9000 / 127.0.0.1 static URL
  if (url.includes("localhost:9000") || url.includes("127.0.0.1:9000")) {
    const filename = url.split("/").pop() || ""
    const cleanName = filename.replace(/^\d+-/, "").replace(/\.[^.]+$/, "")

    if (STATIC_PRODUCT_MAP[cleanName]) {
      return STATIC_PRODUCT_MAP[cleanName]
    }

    const cleanWithExt = filename.replace(/^\d+-/, "")
    for (const [, mapped] of Object.entries(STATIC_PRODUCT_MAP)) {
      if (mapped.endsWith(cleanWithExt)) {
        return mapped
      }
    }
  }

  return url
}
