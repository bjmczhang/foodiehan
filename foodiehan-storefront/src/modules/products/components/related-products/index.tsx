import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "../product-preview"
type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}
export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)
  if (!region) return null
  let products = (
    await listProducts({
      queryParams: {
        limit: 5,
        is_giftcard: false,
        ...(product.collection_id
          ? { collection_id: [product.collection_id] }
          : {}),
      },
      countryCode,
    })
  ).response.products.filter((item) => item.id !== product.id)
  if (products.length < 4 && product.collection_id) {
    const fallback = (
      await listProducts({
        queryParams: { limit: 5, is_giftcard: false },
        countryCode,
      })
    ).response.products
    products = Array.from(
      new Map(
        [...products, ...fallback.filter((item) => item.id !== product.id)].map(
          (item) => [item.id, item]
        )
      ).values()
    )
  }
  if (!products.length) return null
  return (
    <section className="border-t border-[#e2e4dc] mt-16 md:mt-24 pt-12 md:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
        <div>
          <p className="eyebrow mb-3">Make a little room</p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
            A few more favourites.
          </h2>
        </div>
        <LocalizedClientLink href="/store" className="text-link">
          Explore the shop →
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8">
        {products.slice(0, 4).map((item) => (
          <li key={item.id}>
            <ProductPreview product={item} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
