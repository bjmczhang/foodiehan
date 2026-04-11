import { Heading } from "@medusajs/ui"

const Hero = () => {
  const imgUrl = "/design/hero.jpg"

  return (
    <div
      className="relative h-[70vh] w-full border-b border-ui-border-base bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url('${imgUrl}')`,
      }}
    >
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 gap-6">
        <span
          className="text-[11px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--color-brand)" }}
        >
          Fresh from the oven
        </span>

        <Heading
          level="h1"
          className="text-5xl small:text-6xl leading-tight font-bold text-white"
        >
          Unspeakably Good
        </Heading>

        <Heading
          level="h2"
          className="text-lg small:text-2xl leading-8 font-medium text-gray-300 max-w-3xl"
        >
          Artisan breads, pastries and cakes crafted with love in small batches.
          Order online or visit our bakery.
        </Heading>

        <div className="flex gap-4 mt-4">
          <a
            href="#"
            className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}
          >
            Order Now
          </a>
          <a
            href="#menu"
            className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wider border"
            style={{ borderColor: "rgba(255,255,255,0.7)", color: "#fff" }}
          >
            Explore Menu
          </a>
        </div>
      </div>
    </div>
  )
}

export default Hero
