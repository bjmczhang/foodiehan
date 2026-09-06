import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12
export default async function PaginatedProducts({
  sortBy = "created_at",
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  q,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  q?: string
}) {
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: PRODUCT_LIMIT,
    ...(collectionId ? { collection_id: [collectionId] } : {}),
    ...(categoryId ? { category_id: [categoryId] } : {}),
    ...(productsIds ? { id: productsIds } : {}),
    ...(q ? { q } : {}),
  }
  const region = await getRegion(countryCode)
  if (!region)
    return (
      <p className="surface-panel">The shop is unavailable in this region.</p>
    )
  let products: HttpTypes.StoreProduct[]
  let count: number
  let currentPage = page
  if (sortBy === "created_at") {
    const result = await listProducts({
      pageParam: page,
      queryParams: { ...queryParams, order: "-created_at" },
      countryCode,
    })
    products = result.response.products
    count = result.response.count
    const lastPage = Math.max(1, Math.ceil(count / PRODUCT_LIMIT))
    if (page > lastPage) {
      currentPage = lastPage
      products = (
        await listProducts({
          pageParam: lastPage,
          queryParams: { ...queryParams, order: "-created_at" },
          countryCode,
        })
      ).response.products
    }
  } else {
    // Fetch all pages before sorting calculated regional prices, without truncating the catalogue.
    const first = await listProducts({
      queryParams: { ...queryParams, limit: 100 },
      countryCode,
    })
    const allProducts = [...first.response.products]
    count = first.response.count
    for (let nextPage = 2; allProducts.length < count; nextPage++) {
      const batch = await listProducts({
        pageParam: nextPage,
        queryParams: { ...queryParams, limit: 100 },
        countryCode,
      })
      if (!batch.response.products.length) break
      allProducts.push(...batch.response.products)
    }
    const minimumPrice = (product: HttpTypes.StoreProduct) => {
      const prices = (product.variants || [])
        .map((variant) => variant.calculated_price?.calculated_amount)
        .filter((price): price is number => typeof price === "number")
      return prices.length ? Math.min(...prices) : null
    }
    allProducts.sort((a, b) => {
      const aPrice = minimumPrice(a),
        bPrice = minimumPrice(b)
      if (aPrice === null) return bPrice === null ? 0 : 1
      if (bPrice === null) return -1
      return sortBy === "price_asc" ? aPrice - bPrice : bPrice - aPrice
    })
    currentPage = Math.min(page, Math.max(1, Math.ceil(count / PRODUCT_LIMIT)))
    products = allProducts.slice(
      (currentPage - 1) * PRODUCT_LIMIT,
      currentPage * PRODUCT_LIMIT
    )
  }
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  return (
    <div>
      <div
        className="flex flex-wrap items-center justify-between gap-2 mb-6 text-sm text-[#73766c]"
        aria-live="polite"
      >
        <p>
          {q ? (
            <>
              Results for{" "}
              <span className="text-[#272b24] font-medium">“{q}”</span> ·{" "}
            </>
          ) : null}
          {count} {count === 1 ? "product" : "products"}
        </p>
        {count > PRODUCT_LIMIT && (
          <p>
            Showing {(currentPage - 1) * PRODUCT_LIMIT + 1}–
            {Math.min(currentPage * PRODUCT_LIMIT, count)}
          </p>
        )}
      </div>
      {products.length ? (
        <ul
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-9 md:gap-y-12"
          data-testid="products-list"
        >
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface-panel text-center py-16">
          <p className="eyebrow mb-3">A fresh start</p>
          <h2 className="text-3xl font-serif mb-3">No products found.</h2>
          <p className="text-[#73766c] mb-6">
            Try another search or explore the full collection.
          </p>
          <LocalizedClientLink href="/store" className="button-primary">
            Explore all products
          </LocalizedClientLink>
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}
