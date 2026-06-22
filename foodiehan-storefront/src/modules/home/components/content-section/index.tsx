import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ContentSectionProps = {
  headline: string
  body: string
  images: { src: string; alt: string }[]
  imagePosition: "left" | "right"
  cta?: { label: string; href: string }
  bgClass?: string
}

export default function ContentSection({
  headline,
  body,
  images,
  imagePosition,
  cta,
  bgClass = "",
}: ContentSectionProps) {
  const imageColumn = (
    <div className="relative w-full small:w-1/2 min-h-[400px] small:min-h-[600px] overflow-hidden">
      {images.length === 1 ? (
        <img
          src={images[0].src}
          alt={images[0].alt}
          className="absolute inset-0 object-cover w-full h-full"
        />
      ) : (
        <div className="grid w-full h-full grid-cols-1 grid-rows-2 gap-0">
          {images.slice(0, 2).map((img, i) => (
            <div key={i} className="relative overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const textColumn = (
    <div className="flex flex-col justify-center w-full small:w-1/2 px-6 py-16 small:px-16 small:py-20 medium:px-20">
      <h2
        className="mb-6 text-4xl font-light leading-tight tracking-wide sm:text-5xl lg:text-6xl"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "var(--color-text-primary)",
        }}
      >
        {headline}
      </h2>
      <p
        className="mb-8 text-base font-light leading-relaxed sm:text-lg"
        style={{
          fontFamily: "'Rubik', sans-serif",
          color: "var(--color-text-secondary)",
          lineHeight: "1.8",
        }}
      >
        {body}
      </p>
      {cta && (
        <LocalizedClientLink
          href={cta.href}
          className="btn-brand-outline"
        >
          {cta.label}
        </LocalizedClientLink>
      )}
    </div>
  )

  return (
    <section className={`w-full ${bgClass}`}>
      <div className="flex flex-col small:flex-row">
        {imagePosition === "left" ? (
          <>
            {imageColumn}
            {textColumn}
          </>
        ) : (
          <>
            {textColumn}
            {imageColumn}
          </>
        )}
      </div>
    </section>
  )
}
