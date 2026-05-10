import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SectionWrapper from "@modules/common/components/section-wrapper"
import ImageCarousel from "./image-carousel"

const carouselImages = [
  { src: "/images/brand1.jpg", alt: "" },
  { src: "/images/brand2.jpg", alt: "" },
  { src: "/images/brand3.jpg", alt: "" },
  { src: "/images/brand4.jpg", alt: "" },
  { src: "/images/brand5.jpg", alt: "" },
  { src: "/images/brand6.jpg", alt: "" },
]

export default function BrandIntro() {
  return (
    <>
      <SectionWrapper>
        <div className="flex flex-col items-center text-center gap-y-6">
          <h3
            className="text-2xl tracking-widest uppercase"
            style={{
              fontFamily: "'Rubik', sans-serif",
              whiteSpace: "pre-wrap",
            }}
          >
            ARTISAN
          </h3>
          <p className="text-lg italic font-light text-gray-600">
            The art of handcrafted baking
          </p>
          <p className="max-w-3xl text-lg font-light leading-loose text-gray-700">
            Rooted in tradition and shaped by passion, Foodiehan brings together
            the finest ingredients and time-honoured techniques to create breads
            and pastries that delight the senses. Every loaf, every pastry,
            every bite is a celebration of texture, aroma, and taste — crafted
            with care from sunrise to sunset, so that your table always feels
            like home.
          </p>
        </div>
      </SectionWrapper>

      {/* Full-width carousel outside the constrained container */}
      <div>
        <ImageCarousel images={carouselImages} />
      </div>

      <SectionWrapper>
        <div className="flex flex-col items-center">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center justify-center px-9 py-5 border-2 border-[var(--color-border-dark)] bg-[var(--color-border-dark)] text-white uppercase tracking-wider hover:bg-transparent hover:text-[var(--color-border-dark)] transition duration-300 ease-in-out"
          >
            Discover
          </LocalizedClientLink>
        </div>
      </SectionWrapper>
    </>
  )
}
