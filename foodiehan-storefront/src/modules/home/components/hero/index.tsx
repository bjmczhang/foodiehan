import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "@medusajs/icons"

export default function Hero() {
  return (
    <>
      <section className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">Korean soul. Everyday goodness.</p>
          <h1 className="hero-title">
            Good things.
            <br />
            Made <em>with care.</em>
          </h1>
          <p className="page-description max-w-[340px]">
            Soft buns, golden bakes and familiar flavours with a little twist.
            Find a new favourite for your everyday moments.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-7">
            <LocalizedClientLink href="/store" className="button-primary">
              Explore the shop <ArrowRight className="w-4 h-4" />
            </LocalizedClientLink>
            <LocalizedClientLink href="/about" className="text-link">
              Our story <span aria-hidden="true">↗</span>
            </LocalizedClientLink>
          </div>
          <p className="mt-12 flex items-center gap-3 text-[11px] text-[#73766c]">
            <span className="w-2 h-2 rounded-full bg-[#85926b]" /> A little
            comfort. A lot to love.
          </p>
        </div>
        <div className="hero-photo">
          <Image
            src="/images/hero.jpg"
            alt="Golden buns, artisan bread and Korean-inspired bakes from FoodieHan"
            fill
            priority
            sizes="(max-width: 639px) 100vw, 52vw"
          />
          <LocalizedClientLink href="/store" className="hero-photo-label">
            <span>
              <span className="eyebrow !text-[9px] block mb-1">
                Meet your new favourites
              </span>
              Small joys, by the dozen.
            </span>
            <span
              className="rounded-full border border-[#b7bba9] p-2"
              aria-hidden="true"
            >
              <ArrowRight className="w-4 h-4" />
            </span>
          </LocalizedClientLink>
        </div>
      </section>
      <div className="values-strip">
        <div>
          <span className="text-lg" aria-hidden="true">
            ✳
          </span>
          <span>Inspired by Korean flavours</span>
        </div>
        <div>
          <svg
            width="21"
            height="21"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M12 20S3 14 3 8.5a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1C21 14 12 20 12 20Z" />
          </svg>
          <span>Made to be shared</span>
        </div>
        <div>
          <svg
            width="21"
            height="21"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M5 8h14l1 13H4L5 8Z" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" />
          </svg>
          <span>Your favourites, a click away</span>
        </div>
      </div>
    </>
  )
}
