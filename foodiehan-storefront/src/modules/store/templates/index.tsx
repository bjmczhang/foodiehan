import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

export type StoreTemplateProps = {
  sortBy?: SortOptions
  page?: string
  q?: string
  countryCode: string
  categoryId?: string
  collectionId?: string
  title?: string
  description?: string
  categoryChildren?: { id: string; name: string; handle: string }[]
  kind?: "shop" | "search" | "category" | "collection"
}

export default async function StoreTemplate({
  sortBy,
  page,
  q = "",
  countryCode,
  categoryId,
  collectionId,
  title,
  description,
  kind = "shop",
  categoryChildren = [],
}: StoreTemplateProps) {
  const pageNumber = Math.max(1, Number.parseInt(page || "1", 10) || 1)
  const sort = ["price_asc", "price_desc", "created_at"].includes(sortBy || "")
    ? sortBy!
    : "created_at"
  const search = q.trim()
  const categories = await listCategories({
    parent_category_id: "null",
    fields: "id,name,handle",
  })
  const heading =
    title ||
    (kind === "search"
      ? "Find your next favourite."
      : "A little something delicious.")
  const subtitle =
    description ||
    (kind === "search"
      ? "Search our bakery and pantry. Something good is just a few letters away."
      : "From everyday favourites to something a little special. Explore the FoodieHan collection.")
  return (
    <div className="page-shell" data-testid="category-container">
      <header className="max-w-3xl mb-10 md:mb-14">
        <p className="eyebrow mb-4">
          {kind === "search"
            ? "Search the shop"
            : kind === "collection"
            ? "The collection"
            : "The FoodieHan shop"}
        </p>
        <h1
          className="page-title"
          data-testid={
            kind === "category" ? "category-page-title" : "store-page-title"
          }
        >
          {heading}
        </h1>
        <p className="page-description mt-5">{subtitle}</p>
      </header>
      <RefinementList
        sortBy={sort}
        search
        q={search}
        data-testid="sort-by-container"
      />
      <nav
        aria-label="Product categories"
        className="flex flex-wrap gap-2 border-b border-[#e2e4dc] pb-6 mb-8"
      >
        <LocalizedClientLink
          href={search ? `/store?q=${encodeURIComponent(search)}` : "/store"}
          className={`px-5 py-2.5 text-sm rounded-full border transition-colors ${
            !categoryId && !collectionId
              ? "bg-[#323c2b] text-white border-[#323c2b]"
              : "bg-white border-[#e2e4dc] hover:border-[#323c2b]"
          }`}
          aria-current={!categoryId && !collectionId ? "page" : undefined}
        >
          All products
        </LocalizedClientLink>
        {(categories || []).map((category) => (
          <LocalizedClientLink
            key={category.id}
            href={`/categories/${category.handle}${
              search ? `?q=${encodeURIComponent(search)}` : ""
            }`}
            className={`px-5 py-2.5 text-sm rounded-full border transition-colors ${
              categoryId === category.id
                ? "bg-[#323c2b] text-white border-[#323c2b]"
                : "bg-white border-[#e2e4dc] hover:border-[#323c2b]"
            }`}
            aria-current={categoryId === category.id ? "page" : undefined}
          >
            {category.name}
          </LocalizedClientLink>
        ))}
        {collectionId && (
          <span className="px-5 py-2.5 text-sm rounded-full bg-[#323c2b] text-white">
            {title}
          </span>
        )}
      </nav>
      {categoryChildren.length > 0 && (
        <nav aria-label="Subcategories" className="flex flex-wrap gap-4 mb-8">
          {categoryChildren.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="text-link"
            >
              {category.name} &rarr;
            </LocalizedClientLink>
          ))}
        </nav>
      )}
      <Suspense
        key={`${sort}-${pageNumber}-${search}-${categoryId}`}
        fallback={<SkeletonProductGrid numberOfProducts={8} />}
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          categoryId={categoryId}
          collectionId={collectionId}
          q={search}
        />
      </Suspense>
    </div>
  )
}
