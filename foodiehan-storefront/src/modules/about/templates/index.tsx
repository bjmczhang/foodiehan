import LocalizedClientLink from "@modules/common/components/localized-client-link"

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                             */
/* ------------------------------------------------------------------ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-6 text-3xl font-light tracking-wide small:text-4xl"
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        color: "var(--color-text-primary)",
      }}
    >
      {children}
    </h2>
  )
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl leading-relaxed space-y-5" style={{ color: "var(--color-text-secondary)", lineHeight: "1.8" }}>
      {children}
    </div>
  )
}

/** Full-width hero/image banner */
function FullBleedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "65vh", maxHeight: "700px" }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 object-cover w-full h-full"
      />
    </section>
  )
}

/** Centered text section (full-width image → text, like Laurent's "The Beginning" & "Expansion") */
function CenteredTextSection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="py-16 small:py-24">
      <div className="max-w-[750px] mx-auto px-6">
        <SectionHeading>{heading}</SectionHeading>
        <SectionBody>{children}</SectionBody>
      </div>
    </section>
  )
}

/** Two-column image + text section (like Laurent's "The First Store" & "Laurent Today") */
function SplitSection({
  heading,
  image,
  imagePosition = "left",
  children,
}: {
  heading: string
  image: { src: string; alt: string }
  imagePosition?: "left" | "right"
  children: React.ReactNode
}) {
  const imageColumn = (
    <div className="relative w-full small:w-1/2 min-h-[400px] small:min-h-[600px] overflow-hidden">
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 object-cover w-full h-full"
      />
    </div>
  )

  const textColumn = (
    <div className="flex flex-col justify-center w-full small:w-1/2 px-6 py-16 small:px-16 small:py-20 medium:px-20">
      <SectionHeading>{heading}</SectionHeading>
      <SectionBody>{children}</SectionBody>
    </div>
  )

  return (
    <section className="w-full">
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

/* ------------------------------------------------------------------ */
/*  Page Template                                                     */
/* ------------------------------------------------------------------ */

export default function AboutTemplate() {
  return (
    <>
      {/* ── Hero image ─────────────────────────────────────────── */}
      <FullBleedImage
        src="/images/hero.jpg"
        alt="FoodieHan bakery — artisan bread and pastries"
      />

      {/* ── The Beginning ──────────────────────────────────────── */}
      <CenteredTextSection heading="The Beginning">
        <p>
          FoodieHan began with a simple belief: that the finest baking traditions
          of France and the bold, vibrant flavours of Asia belong on the same
          table. Our founder grew up between two culinary worlds — summers spent
          in his grandmother&apos;s kitchen in Guangdong, where steamed buns and
          lotus-paste pastries were made by hand each morning, and years training
          in the artisan bakeries of Paris, where patience, levain, and the
          perfect crust were everything.
        </p>
        <p>
          After honing his craft at one of France&apos;s most respected pastry
          schools, he returned to Australia with a vision: to build a bakery that
          honoured both traditions. No shortcuts, no added yeast in the
          sourdough — just naturally leavened bread, hand-shaped pastries, and a
          menu that tells the story of two cultures through flour, butter, and
          time.
        </p>
      </CenteredTextSection>

      {/* ── The First Store (two-column) ────────────────────────── */}
      <SplitSection
        heading="The First Store"
        image={{ src: "/images/brand1.jpg", alt: "The first FoodieHan bakery storefront" }}
        imagePosition="left"
      >
        <p>
          In 2015, FoodieHan opened its doors in the heart of Sydney&apos;s inner
          west — a small corner bakery with big windows, a wood-fired oven, and
          the smell of fresh bread drifting down the street by 6 am. From day
          one, the neighbourhood embraced us. Locals became regulars, regulars
          became friends, and our little bakery became a gathering place where
          anyone could stop in for a croissant, a mooncake, or a chat.
        </p>
        <p>
          Today that first bakery is still our home — a place where the spirit of
          craft-baking is celebrated with every loaf that leaves the oven, and
          where the door is always open.
        </p>
      </SplitSection>

      {/* ── Full-width image ──────────────────────────────────── */}
      <FullBleedImage
        src="/images/brand2.jpg"
        alt="Fresh artisan bread and pastries at FoodieHan"
      />

      {/* ── Expansion ──────────────────────────────────────────── */}
      <CenteredTextSection heading="Expansion">
        <p>
          As word spread and queues grew longer, we expanded — one neighbourhood
          at a time. Each new FoodieHan location is designed to be more than a
          bakery: it&apos;s a vibrant community hub where friends meet for coffee,
          families gather on weekends, and everyone is welcome. We&apos;re proud
          to bring authentic French techniques and Asian-inspired flavours to more
          tables than ever — while staying true to the small-batch, handmade ethos
          that started it all.
        </p>
        <div className="mt-8">
          <LocalizedClientLink
            href="/contact"
            className="btn-brand-outline"
          >
            See Locations
          </LocalizedClientLink>
        </div>
      </CenteredTextSection>

      {/* ── Laurent Today (two-column) ─────────────────────────── */}
      <SplitSection
        heading="FoodieHan Today"
        image={{ src: "/images/brand4.jpg", alt: "The FoodieHan team at work" }}
        imagePosition="left"
      >
        <p>
          From that first corner bakery in Sydney, FoodieHan has grown into a
          team of over 100 passionate bakers, pastry chefs, and front-of-house
          staff — each one dedicated to the craft of making food that brings
          people together. Our ovens run from dawn to dusk, and every single item
          that leaves our kitchen is made fresh that day.
        </p>
        <p>
          We remain a family-run bakery at heart, with our founder still in the
          kitchen each week, dreaming up new creations and tasting every batch of
          sourdough. The recipes have grown, the team has grown, but the mission
          is unchanged: to bake with integrity, to honour the traditions that
          shaped us, and to share the flavours we love with the community
          we&apos;re proud to call home.
        </p>
        <p>
          Today, with locations across Sydney and a team that feels more like
          family, FoodieHan continues to write its story — one loaf, one pastry,
          one smile at a time.
        </p>
      </SplitSection>
    </>
  )
}
