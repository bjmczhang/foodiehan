import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SectionWrapper from "@modules/common/components/section-wrapper"

export default function BrandIntro() {
  return (
    <SectionWrapper>
      <div className="flex flex-col items-center text-center gap-y-6">
        <h3
          className="text-2xl tracking-widest uppercase"
          style={{ fontFamily: "'Rubik', sans-serif", whiteSpace: "pre-wrap" }}
        >
          ARTISAN
        </h3>
        <p className="text-lg italic font-light text-gray-600">
          The art of handcrafted baking
        </p>
        <p className="max-w-3xl text-lg font-light leading-loose text-gray-700">
          Rooted in tradition and shaped by passion, Foodiehan brings together
          the finest ingredients and time-honoured techniques to create breads
          and pastries that delight the senses. Every loaf, every pastry, every
          bite is a celebration of texture, aroma, and taste — crafted with care
          from sunrise to sunset, so that your table always feels like home.
        </p>
        <LocalizedClientLink
          href="/store"
          className="mt-4 inline-flex items-center justify-center px-9 py-5 border-2 border-[var(--color-border-dark)] uppercase tracking-wider hover:bg-[var(--color-border-dark)] hover:text-white transition duration-300 ease-in-out"
        >
          Discover
        </LocalizedClientLink>
      </div>
    </SectionWrapper>
  )
}
