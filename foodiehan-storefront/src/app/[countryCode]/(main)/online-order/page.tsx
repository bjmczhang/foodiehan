import { Metadata } from "next"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import OnlineOrderTemplate from "@modules/store/templates/online-order-template"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Online Order | FoodieHan",
  description: "Order fresh artisan baked goods and Asian delights online.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ category?: string }>
}

export default async function OnlineOrderPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  const { countryCode } = params
  const activeCategoryHandle = searchParams.category ?? null

  const region = await getRegion(countryCode)
  if (!region) {
    return notFound()
  }

  // Fetch top-level categories (no parent) for the filter tabs
  const allCategories = await listCategories({ parent_category_id: "null" })
  const categories = (allCategories ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
  }))

  // Find category id to filter products when a category tab is active
  let categoryId: string | undefined
  if (activeCategoryHandle) {
    const found = (allCategories ?? []).find(
      (c: any) => c.handle === activeCategoryHandle
    )
    categoryId = found?.id
  }

  // Fetch products — filtered by category if one is selected
  const queryParams: Record<string, any> = {
    limit: 100,
  }
  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams,
  })

  return (
    <OnlineOrderTemplate
      categories={categories}
      products={products}
      regionId={region.id}
      activeCategoryHandle={activeCategoryHandle}
    />
  )
}
