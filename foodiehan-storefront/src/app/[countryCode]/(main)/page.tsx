import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryBanner from "@modules/home/components/category-banner"
import BrandIntro from "@modules/home/components/brand-intro"
import BestSellingProducts from "@modules/home/components/best-selling-products"
import BrandFeatures from "@modules/home/components/brand-features"
import PricingList from "@modules/home/components/pricing-list"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "FoodieHan Storefront",
  description:
    "The art of handcrafted baking, where every bite tells a story of passion and flavor. Welcome to FoodieHan, your destination for artisanal delights that awaken the senses and satisfy the soul.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <BrandIntro />
      <CategoryBanner />
      <BestSellingProducts region={region} />
      {/* <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div> */}
      <BrandFeatures />
      <PricingList region={region} />
    </>
  )
}
