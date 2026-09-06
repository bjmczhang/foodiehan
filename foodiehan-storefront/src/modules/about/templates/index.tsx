import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function AboutTemplate() {
  return (
    <>
      <section className="page-shell text-center !pb-12">
        <p className="eyebrow mb-5">Our story</p>
        <h1 className="page-title">
          A little Seoul.
          <br />
          <em>A lot of heart.</em>
        </h1>
        <p className="page-description mx-auto mt-6">
          Food brings us together. We’re here for the familiar flavours, the new
          discoveries, and the everyday moments in between.
        </p>
      </section>
      <div className="page-shell !py-0">
        <div className="relative h-[280px] small:h-[470px] rounded-2xl overflow-hidden">
          <Image
            src="/images/brand3.jpg"
            alt="A warm bakery counter filled with breads and pastries"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 1280px"
          />
        </div>
      </div>
      <section className="page-shell grid small:grid-cols-[1fr_1.3fr] gap-10 small:gap-24">
        <div>
          <p className="eyebrow mb-5">What brings us to the table</p>
          <h2 className="section-heading">
            Comfort, with
            <br />a little curiosity.
          </h2>
        </div>
        <div className="page-description space-y-5">
          <p>
            A bun filled with sweet red bean. The golden edges of a buttery
            bake. The bold, familiar flavour of kimchi. At FoodieHan, we believe
            good food can feel like home and still give you something new to
            discover.
          </p>
          <p>
            Our selection brings Korean-inspired flavours and bakery favourites
            together in one place. Sweet or savoury, a little treat for yourself
            or something to share, there’s a place for it at our table.
          </p>
          <p>
            That’s the spirit of FoodieHan: simple pleasures, thoughtfully
            chosen, for your every day.
          </p>
        </div>
      </section>
      <section className="bg-[#eeeee7]">
        <div className="page-shell">
          <p className="eyebrow mb-4">The things we care about</p>
          <h2 className="section-heading mb-12">Good food. Good moments.</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                n: "01",
                title: "Rooted in flavour",
                text: "Korean favourites and comforting bakes, with flavours that feel both familiar and full of possibility.",
              },
              {
                n: "02",
                title: "The little details",
                text: "Soft centres, golden crusts and satisfying textures. Because the small things make a favourite.",
              },
              {
                n: "03",
                title: "Better together",
                text: "A morning pause, an afternoon catch-up, or a table full of friends. Good food belongs in good company.",
              },
            ].map((item) => (
              <div key={item.n} className="border-t border-[#cbd0bd] pt-6">
                <span className="eyebrow">{item.n}</span>
                <h3 className="text-xl font-serif mt-5 mb-4">{item.title}</h3>
                <p className="text-sm leading-7 text-[#73766c]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-shell">
        <div className="story-grid">
          <div className="story-copy">
            <p className="eyebrow mb-5">Come on in</p>
            <h2 className="section-heading">
              Find your
              <br />
              FoodieHan favourite.
            </h2>
            <p className="page-description mt-5 mb-7">
              Start with something you love. Stay for something you haven’t
              tried yet.
            </p>
            <LocalizedClientLink href="/store" className="button-primary">
              Explore the shop <span aria-hidden="true">→</span>
            </LocalizedClientLink>
          </div>
          <div className="story-image relative min-h-[350px]">
            <Image
              src="/images/hero.jpg"
              alt="A selection of golden buns and artisan bread"
              fill
              sizes="(max-width:639px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}
