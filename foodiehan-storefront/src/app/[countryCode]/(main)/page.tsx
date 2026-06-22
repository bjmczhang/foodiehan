import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import ContentSection from "@modules/home/components/content-section"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "FoodieHan | Artisan Bakery",
  description:
    "Handcrafted breads and pastries made with time-honoured techniques and the finest ingredients. Welcome to FoodieHan, your destination for artisanal delights.",
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

      {/* Section 1: A Sweet Escape — image left, text right */}
      <ContentSection
        headline="A Sweet Escape"
        body="Our sweets are meticulously handcrafted with a fusion of passion and expertise, creating an indulgent experience in every bite. From delicate pastries to rich cakes, each creation is designed to elevate your special occasions or bring a touch of sweetness to everyday moments with an irresistible array of flavours and textures."
        images={[
          { src: "/images/brand2.jpg", alt: "Handcrafted pastries" },
          { src: "/images/brand3.jpg", alt: "Artisan sweets" },
        ]}
        imagePosition="left"
        cta={{ label: "Discover More", href: "/online-order" }}
      />

      {/* Section 2: Passion For Pastry — text left, image right (alternating) */}
      <ContentSection
        headline="Passion For Pastry"
        body="Patisserie is French for pure pleasure — flaky, buttery, crumbly textures that melt in your mouth and linger in your memory. We invite you to explore the real flavours of France, where every pastry unlocks a treasure trove of exquisite tastes and aromas, crafted with the same devotion found in the finest Parisian bakeries."
        images={[
          { src: "/images/brand4.jpg", alt: "French patisserie" },
          { src: "/images/brand5.jpg", alt: "Buttery pastries" },
        ]}
        imagePosition="right"
        cta={{ label: "Explore Menu", href: "/online-order" }}
        bgClass="bg-[var(--color-surface)]"
      />

      {/* Section 3: Heart And Soul — image left, text right */}
      <ContentSection
        headline="Heart And Soul"
        body="Bread is the heart and soul of FoodieHan. Our authentic artisan breads are made with time-honoured recipes and contemporary techniques using only the finest ingredients. Each loaf in our signature range is crafted from a naturally fermented starter, receiving over 30 hours of meticulous care and attention — resulting in a deep, complex flavour and a perfectly crisp crust."
        images={[
          { src: "/images/brand1.jpg", alt: "Artisan bread" },
          { src: "/images/brand6.jpg", alt: "Fresh baked loaves" },
        ]}
        imagePosition="left"
        cta={{ label: "View Products", href: "/online-order" }}
      />
    </>
  )
}
