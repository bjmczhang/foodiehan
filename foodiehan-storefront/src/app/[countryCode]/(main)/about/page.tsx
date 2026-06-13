import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"

export const metadata: Metadata = {
  title: "About Us | FoodieHan",
  description:
    "Discover the story behind FoodieHan — where Asian heritage meets artisan French baking. Freshly baked breads, pastries, and cakes in Sydney.",
}

export default async function AboutPage() {
  return <AboutTemplate />
}
