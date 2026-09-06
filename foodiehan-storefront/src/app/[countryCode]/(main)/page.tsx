import { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "FoodieHan | A little everyday goodness",
  description:
    "Discover Korean-inspired buns, artisan bakes and everyday favourites. Explore the FoodieHan shop and find something good to share.",
}
async function FreshPicks({ countryCode }: { countryCode: string }) {
  const region = await getRegion(countryCode)
  const result = await listProducts({
    countryCode,
    queryParams: { limit: 4, order: "-created_at" },
  }).catch(() => null)
  if (!region || !result)
    return (
      <div className="surface-panel text-center">
        <p className="page-description mx-auto">
          Our latest bakes are taking a moment to load.
        </p>
        <LocalizedClientLink className="text-link mt-5" href="/store">
          Explore the shop →
        </LocalizedClientLink>
      </div>
    )
  if (!result.response.products.length)
    return (
      <div className="surface-panel text-center">
        <p className="page-description mx-auto">
          Good things are on their way. Check back for our latest bakes.
        </p>
      </div>
    )
  return (
    <div className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8 small:gap-x-6">
      {result.response.products.map((product) => (
        <ProductPreview key={product.id} product={product} region={region} />
      ))}
    </div>
  )
}
export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  return (
    <>
      <Hero />
      <section className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">Something delicious awaits</p>
            <h2 className="section-heading">Fresh from our selection.</h2>
          </div>
          <LocalizedClientLink href="/store" className="text-link">
            Shop all bakes <span aria-hidden="true">↗</span>
          </LocalizedClientLink>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 small:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="aspect-[4/5] rounded-xl animate-pulse bg-[#eeeee6]"
                />
              ))}
            </div>
          }
        >
          <FreshPicks countryCode={countryCode} />
        </Suspense>
      </section>
      <section className="bg-[#eeeee7]">
        <div className="page-shell">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Follow your cravings</p>
            <h2 className="section-heading">A little of what you love.</h2>
          </div>
          <div className="grid grid-cols-2 small:grid-cols-4 gap-4 small:gap-6">
            {[
              {
                name: "Soft & comforting",
                detail: "Buns worth slowing down for",
                image: "/images/products/buns/red-bean-bun.webp",
                q: "bun",
              },
              {
                name: "Golden & buttery",
                detail: "The everyday favourites",
                image: "/images/products/breads/salted-butter-bun.webp",
                q: "butter",
              },
              {
                name: "A little sweetness",
                detail: "Make a moment of it",
                image: "/images/products/breads/sweet-potato-ball.webp",
                q: "sweet",
              },
              {
                name: "Something savoury",
                detail: "Big flavour, a little twist",
                image: "/images/products/kimchi/korean-kimchi.webp",
                q: "kimchi",
              },
            ].map((item) => (
              <LocalizedClientLink
                href={`/store?q=${item.q}`}
                key={item.q}
                className="category-tile !bg-[#f8f7f3] group"
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 1023px) 45vw, 22vw"
                    className="object-contain p-6"
                  />
                </div>
                <div className="p-5 pt-0">
                  <div className="flex justify-between gap-2 text-sm font-medium">
                    <h3>{item.name}</h3>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <p className="text-xs text-[#73766c] mt-2 leading-5">
                    {item.detail}
                  </p>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>
      <section className="page-shell">
        <div className="story-grid">
          <div className="story-image relative min-h-[420px]">
            <Image
              src="/images/brand4.jpg"
              alt="Traditional Korean rice cakes being prepared by hand"
              fill
              sizes="(max-width: 639px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="story-copy">
            <p className="eyebrow mb-6">The heart of FoodieHan</p>
            <h2 className="section-heading">
              Familiar flavours.
              <br />A fresh perspective.
            </h2>
            <p className="page-description mt-6 mb-8">
              We bring the comfort of Korean flavours to the everyday table.
              From a soft red bean bun to something golden and buttery, our
              selection is a celebration of the little things that bring us
              together.
            </p>
            <LocalizedClientLink href="/about" className="text-link">
              Get to know us <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
          </div>
        </div>
      </section>
      <section className="border-t border-[#e2e4dc] text-center">
        <div className="page-shell !pt-14 !pb-16">
          <p className="eyebrow mb-4">Your next good moment</p>
          <h2 className="section-heading mb-7">
            There’s always room for something good.
          </h2>
          <LocalizedClientLink href="/store" className="button-primary">
            Find your favourite <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
