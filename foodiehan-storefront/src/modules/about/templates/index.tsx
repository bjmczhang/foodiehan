import LocalizedClientLink from "@modules/common/components/localized-client-link"

/* ------------------------------------------------------------------ */
/*  Shared sub-components for the narrative layout                   */
/* ------------------------------------------------------------------ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-3xl font-semibold text-[var(--color-text-primary)] small:text-4xl">
      {children}
    </h2>
  )
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl leading-relaxed text-[var(--color-text-secondary)] space-y-5">
      {children}
    </div>
  )
}

function TextSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="py-16 small:py-24">
      <div className="content-container">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading>{heading}</SectionHeading>
          <SectionBody>{children}</SectionBody>
        </div>
      </div>
    </section>
  )
}

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

/* ------------------------------------------------------------------ */
/*  Page Template                                                     */
/* ------------------------------------------------------------------ */

export default function AboutTemplate() {
  return (
    <>
      {/* ── Hero image ─────────────────────────────────────────── */}
      <FullBleedImage
        src="/images/hero.jpg"
        alt="FoodieHan bakery — fresh artisan bread and pastries"
      />

      {/* ── The Beginning ──────────────────────────────────────── */}
      <TextSection heading="Our Story">
        <p>
          FoodieHan began with a simple belief: that the finest baking traditions of France
          and the bold, vibrant flavours of Asia belong on the same table. Our founder grew up
          between two culinary worlds — summers spent in his grandmother&apos;s kitchen in
          Guangdong, where steamed buns and lotus-paste pastries were made by hand each
          morning, and years training in the artisan bakeries of Paris, where patience,
          levain, and the perfect crust were everything.
        </p>
        <p>
          After honing his craft at one of France&apos;s most respected pastry schools, he
          returned to Australia with a vision: to build a bakery that honoured both
          traditions. No shortcuts, no added yeast in the sourdough — just naturally leavened
          bread, hand-shaped pastries, and a menu that tells the story of two cultures through
          flour, butter, and time.
        </p>
      </TextSection>

      {/* ── Image ──────────────────────────────────────────────── */}
      <FullBleedImage
        src="/images/brand1.jpg"
        alt="Baker shaping dough by hand at FoodieHan"
      />

      {/* ── The First Store ────────────────────────────────────── */}
      <TextSection heading="Our First Bakery">
        <p>
          In 2015, FoodieHan opened its doors in the heart of Sydney&apos;s inner west — a
          small corner bakery with big windows, a wood-fired oven, and the smell of fresh
          bread drifting down the street by 6 am. From day one, the neighbourhood embraced us.
          Locals became regulars, regulars became friends, and our little bakery became a
          gathering place where anyone could stop in for a croissant, a mooncake, or a chat.
        </p>
        <p>
          Today that first bakery is still our home — a place where the spirit of
          craft-baking is celebrated with every loaf that leaves the oven, and where the door
          is always open.
        </p>
      </TextSection>

      {/* ── Image ──────────────────────────────────────────────── */}
      <FullBleedImage
        src="/images/brand2.jpg"
        alt="Inside the FoodieHan bakery — warm wood tones and fresh displays"
      />

      {/* ── Philosophy ─────────────────────────────────────────── */}
      <TextSection heading="Our Philosophy">
        <p>
          Great baking isn&apos;t just about ingredients — it&apos;s about time, touch,
          and respect for the craft. Every loaf at FoodieHan is shaped by hand. Every pastry
          is laminated with care. We source the finest flour from local Australian mills,
          butter from grass-fed dairies, and seasonal produce from farms we know by name.
        </p>
        <p>
          Our signature creations — from the char-siu danish to the pandan swirl bread, from
          the black sesame croissant to the classic country sourdough — are built on a
          foundation of French technique, animated by the flavours of Asia. It&apos;s a
          dialogue between two great food traditions, and we think it tastes like home.
        </p>
      </TextSection>

      {/* ── Image ──────────────────────────────────────────────── */}
      <FullBleedImage
        src="/images/brand3.jpg"
        alt="FoodieHan signature pastries and bread on display"
      />

      {/* ── Expansion ──────────────────────────────────────────── */}
      <TextSection heading="Growing Together">
        <p>
          As word spread and queues grew longer, we expanded — one neighbourhood at a time.
          Each new FoodieHan location is designed to be more than a bakery: it&apos;s a
          vibrant community hub where friends meet for coffee, families gather on weekends,
          and everyone is welcome.
        </p>
        <p>
          Today, with multiple locations across Sydney, we&apos;re proud to bring artisan
          bread and Asian-inspired pastries to more tables than ever — while staying true to
          the small-batch, handmade ethos that started it all.
        </p>
        <div className="mt-8">
          <LocalizedClientLink
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium tracking-wider text-white uppercase transition duration-300 ease-in-out rounded-full shadow-sm"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            Find Your Nearest Bakery
          </LocalizedClientLink>
        </div>
      </TextSection>

      {/* ── Image ──────────────────────────────────────────────── */}
      <FullBleedImage
        src="/images/brand4.jpg"
        alt="The FoodieHan team in the bakery"
      />

      {/* ── Today ──────────────────────────────────────────────── */}
      <section
        className="py-16 small:py-24"
        style={{ background: "var(--color-bg-dark)" }}
      >
        <div className="content-container">
          <div className="max-w-[1100px] mx-auto">
            <SectionHeading>
              <span className="text-white">FoodieHan Today</span>
            </SectionHeading>
            <div className="max-w-2xl leading-relaxed space-y-5" style={{ color: "var(--color-text-light)" }}>
              <p>
                From that first corner bakery in Sydney, FoodieHan has grown into a team of
                over 100 passionate bakers, pastry chefs, and front-of-house staff — each one
                dedicated to the craft of making food that brings people together. Our ovens
                run from dawn to dusk, and every single item that leaves our kitchen is made
                fresh that day.
              </p>
              <p>
                We remain a family-run bakery at heart, with our founder still in the kitchen
                each week, dreaming up new creations and tasting every batch of sourdough. The
                recipes have grown, the team has grown, but the mission is unchanged: to bake
                with integrity, to honour the traditions that shaped us, and to share the
                flavours we love with the community we&apos;re proud to call home.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
