"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero.jpg"
          alt="FoodieHan Artisan Bakery"
          className="absolute inset-0 object-cover w-full h-full"
          style={{ objectPosition: "50% 35%" }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
        <h1
          className="mb-4 text-5xl font-light tracking-wide text-white sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Artisan Bakery
        </h1>
        <p
          className="max-w-xl mb-10 text-base font-light leading-relaxed tracking-wide text-white/80 sm:text-lg"
          style={{ fontFamily: "'Rubik', sans-serif" }}
        >
          Handcrafted breads and pastries made with time-honoured
          techniques and the finest ingredients
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <LocalizedClientLink
            href="/online-order"
            className="btn-brand-filled"
          >
            View Products
          </LocalizedClientLink>

          <a
            href="https://order.laurent.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-9 py-3.5 text-sm font-medium text-white uppercase tracking-[0.15em] border-2 border-white/60 rounded-full transition-all duration-300 ease-in-out hover:bg-white hover:text-[var(--color-text-primary)]"
          >
            Order Online
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero
