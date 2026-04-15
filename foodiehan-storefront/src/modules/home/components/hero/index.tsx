"use client"

import React, { useEffect, useRef, useState } from "react"
import { Heading } from "@medusajs/ui"
import SectionWrapper from "../../../common/components/section-wrapper"

const slides = [
  { src: "/images/bread-1.png", title: "Moon Bread", category: "Poppy" },
  { src: "/images/bread-2.png", title: "Yeast Bread", category: "White" },
  { src: "/images/bread-3.png", title: "Eritrea Bread", category: "Black" },
  { src: "/images/bread-4.png", title: "Crusty Baguette", category: "Classic" },
]

const Hero = () => {
  const visibleCount = Math.min(3, slides.length)
  const clones = visibleCount
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

  const initialInternal = clones
  const [internalIndex, setInternalIndex] = useState(initialInternal)
  const internalIndexRef = useRef(initialInternal)
  const isResettingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const setInternalIndexWrapped = (v: number) => {
    internalIndexRef.current = v
    setInternalIndex(v)
  }

  const setTranslate = (translate: number, withTransition = false) => {
    if (!trackRef.current) return
    trackRef.current.style.transition = withTransition
      ? "transform 300ms ease-out"
      : "none"
    trackRef.current.style.transform = `translateX(${translate}px)`
  }

  const animation = () => {
    setTranslate(currentTranslate.current)
    if (isDragging) {
      animationRef.current = requestAnimationFrame(animation)
    }
  }

  const pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    startX.current = e.clientX
    containerRef.current?.setPointerCapture(e.pointerId)
    animationRef.current = requestAnimationFrame(animation)
  }

  const pointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const currentPosition = e.clientX
    const diff = currentPosition - startX.current
    currentTranslate.current = prevTranslate.current + diff
  }

  const pointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    const width = containerRef.current?.offsetWidth ?? 0
    const slideWidth = width / visibleCount
    const movedBy = currentTranslate.current - prevTranslate.current
    const threshold = slideWidth / 4

    if (movedBy < -threshold) {
      setInternalIndexWrapped(internalIndexRef.current + 1)
    } else if (movedBy > threshold) {
      setInternalIndexWrapped(internalIndexRef.current - 1)
    } else {
      // snap back
      setTranslate(prevTranslate.current, true)
    }

    try {
      containerRef.current?.releasePointerCapture(e.pointerId)
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    const update = () => {
      const width = containerRef.current?.offsetWidth ?? 0
      const slideWidth = width / visibleCount
      prevTranslate.current = -internalIndexRef.current * slideWidth
      currentTranslate.current = prevTranslate.current
      setTranslate(prevTranslate.current, !isResettingRef.current)
      if (isResettingRef.current) {
        isResettingRef.current = false
      }
    }

    window.addEventListener("resize", update)
    update()
    return () => window.removeEventListener("resize", update)
  }, [internalIndex, visibleCount])

  // transition end: if we've moved into clones, jump to the corresponding real slide without animation
  useEffect(() => {
    const node = trackRef.current
    if (!node) return

    const handleTransitionEnd = () => {
      if (internalIndexRef.current >= clones + s) {
        // moved past the end clones -> jump back
        const corrected = internalIndexRef.current - s
        isResettingRef.current = true
        internalIndexRef.current = corrected
        setInternalIndex(corrected)
      } else if (internalIndexRef.current < clones) {
        // moved before the start clones -> jump forward
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
      className="relative h-[60vh] w-full border-b border-ui-border-base overflow-hidden bg-[var(--color-bg-darkest)]"
      containerClassName="w-full"
    >
      <div
        ref={trackRef}
        className="flex h-full"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onPointerLeave={pointerUp}
      >
        {extendedSlides.map((sld, i) => (
          <div
            key={`ext-${i}-${sld.src}`}
            className="relative flex items-center justify-center flex-shrink-0 h-full"
            style={{
              width: `${100 / visibleCount}%`,
            }}
          >
            <img
              src={sld.src}
              alt={sld.title}
              className="max-h-[65%] max-w-[70%] object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-4 text-center bg-gradient-to-t from-black/60 to-transparent">
              <div className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                {sld.title}
              </div>
              <div className="text-sm text-white md:text-base opacity-90">
                {sld.category}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous"
        className="absolute z-20 p-2 text-white -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/40"
        onClick={() => setInternalIndexWrapped(internalIndexRef.current - 1)}
      >
        ‹
      </button>

      <button
        aria-label="Next"
        className="absolute z-20 p-2 text-white -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/40"
        onClick={() => setInternalIndexWrapped(internalIndexRef.current + 1)}
      >
        ›
      </button>

      {/* Dots */}
      {/* <div className="absolute z-20 flex gap-2 -translate-x-1/2 bottom-6 left-1/2">
        {(() => {
          const normalized = (((internalIndex - clones) % s) + s) % s
          return Array.from({ length: s }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setInternalIndexWrapped(clones + i)}
              className={`h-2 w-2 rounded-full ${
                i === normalized ? "bg-white" : "bg-white/50"
              }`}
            />
          ))
        })()}
      </div> */}
    </SectionWrapper>
  )
}

export default Hero
