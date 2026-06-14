import { Metadata } from "next"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import OnlineOrderTemplate from "@modules/store/templates/online-order-template"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Full Menu | FoodieHan",
  description:
    "Browse our full menu of fresh artisan baked goods and Asian delights.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function OnlineOrderPage(props: Props) {
  const { countryCode } = (await props.params)

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
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 100,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories",
    },
  })

  return (
    <OnlineOrderTemplate categories={categories} products={products} />
  )
}
