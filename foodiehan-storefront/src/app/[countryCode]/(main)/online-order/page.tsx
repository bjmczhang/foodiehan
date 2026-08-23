import { Metadata } from "next"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import OnlineOrderTemplate from "@modules/store/templates/online-order-template"
import { notFound } from "next/navigation"

const PRODUCT_PAGE_SIZE = 100
const MANNA_SOURCE = "Manna Bakery"

function productPreference(product: any) {
  return (
    (product.metadata?.source === MANNA_SOURCE ? 4 : 0) +
    (product.categories?.length ? 2 : 0) +
    (product.variants?.some((variant: any) => variant.calculated_price) ? 1 : 0)
  )
}

function deduplicateProductsByHandle(products: any[]) {
  const productsByHandle = new Map<string, any>()

  for (const product of products) {
    const key = product.handle || product.id
    const existing = productsByHandle.get(key)

    if (!existing || productPreference(product) > productPreference(existing)) {
      productsByHandle.set(key, product)
    }
  }

  return Array.from(productsByHandle.values())
}

export const metadata: Metadata = {
  title: "Full Menu | FoodieHan",
  description:
    "Browse our full menu of fresh artisan baked goods and Asian delights.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function OnlineOrderPage(props: Props) {
  const { countryCode } = await props.params

  const region = await getRegion(countryCode)
  if (!region) {
    return notFound()
  }

  // Fetch top-level categories
  const allCategories = await listCategories({ parent_category_id: "null" })
  const categories = (allCategories ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
  }))

  // Fetch ALL products (no category filter) — include categories so the
  // client can group them into sections.
  const allProducts = []
  let pageParam = 1

  while (pageParam) {
    const result = await listProducts({
      pageParam,
      regionId: region.id,
      queryParams: {
        limit: PRODUCT_PAGE_SIZE,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories",
      },
    })

    allProducts.push(...result.response.products)
    pageParam = result.nextPage ?? 0
  }

  // The catalog currently contains a few legacy records that share handles
  // with the Manna imports. Match product-detail routing by preferring the
  // imported record, whose price and content are the current source of truth.
  const products = deduplicateProductsByHandle(allProducts)

  return <OnlineOrderTemplate categories={categories} products={products} />
}
