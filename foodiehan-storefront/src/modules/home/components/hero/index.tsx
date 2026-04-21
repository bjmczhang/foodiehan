"use client"

import React, { useEffect, useRef, useState } from "react"
import SectionWrapper from "../../../common/components/section-wrapper"
import LocalizedClientLink from "../../../common/components/localized-client-link"

const slides = [
  {
    // video background from public/images
    video: "/images/hero-video.mp4",
    subtitle: "Artisan Collection",
    title: "Moon Bread",
  },
]

const VISIBLE = 1

const Hero = () => {
  const clones = 1
  const s = slides.length
  const extendedSlides = [
    ...slides.slice(-clones),
    ...slides,
    ...slides.slice(0, clones),
  ]

  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const startX = useRef(0)
  const currentTranslate = useRef(0)
  const prevTranslate = useRef(0)
  const animationRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const isDragEnabledRef = useRef(false)
  const [isDragEnabled, setIsDragEnabled] = useState(false)

  const initialInternal = clones
  const [internalIndex, setInternalIndex] = useState(initialInternal)
  const internalIndexRef = useRef(initialInternal)
  const isResettingRef = useRef(false)

  const setInternalIndexWrapped = (v: number) => {
    internalIndexRef.current = v
    setInternalIndex(v)
  }

  const setTranslate = (translate: number, withTransition = false) => {
    if (!trackRef.current) return
    trackRef.current.style.transition = withTransition
      ? "transform 500ms cubic-bezier(.58,.3,.005,1)"
      : "none"
    trackRef.current.style.transform = `translateX(${translate}px)`
  }

  const animationLoop = () => {
    setTranslate(currentTranslate.current)
    if (isDraggingRef.current) {
      animationRef.current = requestAnimationFrame(animationLoop)
    }
  }

  const pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragEnabledRef.current) return

    isDraggingRef.current = true
    startX.current = e.clientX
    containerRef.current?.setPointerCapture(e.pointerId)
    animationRef.current = requestAnimationFrame(animationLoop)
  }

  const pointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    currentTranslate.current =
      prevTranslate.current + (e.clientX - startX.current)
  }

  const pointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragEnabledRef.current) return

    isDraggingRef.current = false
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    const width = containerRef.current?.offsetWidth ?? 0
    const slideWidth = width / VISIBLE
    const movedBy = currentTranslate.current - prevTranslate.current
    const threshold = slideWidth / 4

    if (movedBy < -threshold) {
      setInternalIndexWrapped(internalIndexRef.current + 1)
    } else if (movedBy > threshold) {
      setInternalIndexWrapped(internalIndexRef.current - 1)
    } else {
      setTranslate(prevTranslate.current, true)
    }

    try {
      containerRef.current?.releasePointerCapture(e.pointerId)
    } catch (_) {}
  }

  const goNext = () => setInternalIndexWrapped(internalIndexRef.current + 1)
  const goPrev = () => setInternalIndexWrapped(internalIndexRef.current - 1)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mq = window.matchMedia?.("(pointer: coarse)")
    const update = (matches?: boolean) => {
      const enabled =
        typeof matches === "boolean" ? matches : mq?.matches ?? false
      isDragEnabledRef.current = enabled
      setIsDragEnabled(enabled)
    }

    update()
    const handler = (e: MediaQueryListEvent) => update(e.matches)
    if (mq?.addEventListener) mq.addEventListener("change", handler)
    else if (mq?.addListener) mq.addListener(handler)

    return () => {
      if (mq?.removeEventListener) mq.removeEventListener("change", handler)
      else if (mq?.removeListener) mq.removeListener(handler)
    }
  }, [])

  const wrapperClass = `group relative h-[70vh] w-full border-b border-ui-border-base overflow-hidden bg-[var(--color-bg-darkest)] ${
    isDragEnabled ? "cursor-grab active:cursor-grabbing" : ""
  }`

  useEffect(() => {
    const update = () => {
      const width = containerRef.current?.offsetWidth ?? 0
      const slideWidth = width / VISIBLE
      prevTranslate.current = -internalIndexRef.current * slideWidth
      currentTranslate.current = prevTranslate.current
      setTranslate(prevTranslate.current, !isResettingRef.current)
      if (isResettingRef.current) isResettingRef.current = false
    }
    window.addEventListener("resize", update)
    update()
    return () => window.removeEventListener("resize", update)
  }, [internalIndex])

  useEffect(() => {
    const node = trackRef.current
    if (!node) return
    const handleTransitionEnd = () => {
      if (internalIndexRef.current >= clones + s) {
        const corrected = internalIndexRef.current - s
        isResettingRef.current = true
        internalIndexRef.current = corrected
        setInternalIndex(corrected)
      } else if (internalIndexRef.current < clones) {
        const corrected = internalIndexRef.current + s
        isResettingRef.current = true
        internalIndexRef.current = corrected
        setInternalIndex(corrected)
      }
    }
    node.addEventListener("transitionend", handleTransitionEnd)
    return () => node.removeEventListener("transitionend", handleTransitionEnd)
  }, [clones, s])

  return (
    <SectionWrapper
      as="div"
      rootRef={containerRef}
      padded={false}
      className={wrapperClass}
      containerClassName="w-full h-full"
    >
      {/* Slide track */}
      <div
        ref={trackRef}
        className="flex h-full select-none will-change-transform"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
      >
        {extendedSlides.map((slide, i) => (
          <div key={i} className="relative flex flex-shrink-0 w-full h-full overflow-hidden">
            {slide.video && (
              <div className="absolute inset-0 z-0">
                <video
                  src={slide.video}
                  className="absolute inset-0 object-cover w-full h-full pointer-events-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{ objectPosition: "50% 25%" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                />
              </div>
            )}

            {/* Constrain left-side content while background covers full slide */}
            <div className="relative z-20 w-full h-full content-container">
              <div className="flex items-center h-full">
                <div className="flex flex-col justify-center w-1/2 gap-y-6">
                  <span className="text-sm uppercase tracking-[0.2em] text-[var(--color-brand)]">
                    {slide.subtitle}
                  </span>
                  <h1
                    className="text-6xl font-medium leading-tight text-white small:text-7xl"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {slide.title}
                  </h1>
                  <LocalizedClientLink
                    href="/store"
                    className="inline-flex items-center justify-center w-fit px-8 py-3 bg-[var(--color-brand)] text-white text-sm uppercase tracking-wider rounded-full shadow-sm hover:bg-[var(--color-brand-hover)] transition duration-300 ease-in-out"
                  >
                    Order Now
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev arrow */}
      {/* <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-[var(--color-brand)] text-[var(--color-brand)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[var(--color-brand)] hover:text-white bg-transparent"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button> */}

      {/* Next arrow */}
      {/* <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-[var(--color-brand)] text-[var(--color-brand)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[var(--color-brand)] hover:text-white bg-transparent"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button> */}
    </SectionWrapper>
  )
}

export default Hero
