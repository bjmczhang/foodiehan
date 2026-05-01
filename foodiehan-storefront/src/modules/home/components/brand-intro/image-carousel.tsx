"use client"

import { useRef, useEffect, useState } from "react"

type ImageCarouselProps = {
  images: { src: string; alt: string }[]
}

const GAP = 0

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const isDragging = useRef(false)
  const startX = useRef(0)
  const prevTranslate = useRef(0)
  const currentTranslate = useRef(0)

  const clones = 2
  const extended = [
    ...images.slice(-clones),
    ...images,
    ...images.slice(0, clones),
  ]

  const [slideWidth, setSlideWidth] = useState(0)

  const currentIndex = useRef(0)

  useEffect(() => {
    const calc = () => {
      const el = containerRef.current
      if (!el) return
      const w = el.offsetWidth
      const v = w < 1024 ? 2 : 3
      const totalGap = (v - 1) * GAP
      setSlideWidth((w - totalGap) / v)
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  useEffect(() => {
    currentTranslate.current = 0
    prevTranslate.current = 0
    currentIndex.current = 0
    if (trackRef.current) {
      trackRef.current.style.transition = "none"
      trackRef.current.style.transform = "translate3d(0px, 0, 0)"
    }
  }, [slideWidth])

  // ---- infinite-loop reset after transition ----
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const unit = slideWidth + GAP

    const onTransitionEnd = () => {
      const idx = currentIndex.current
      const len = images.length
      if (idx < 0) {
        currentIndex.current = idx + len
        currentTranslate.current = -currentIndex.current * unit
        track.style.transition = "none"
        track.style.transform = `translate3d(${currentTranslate.current}px, 0, 0)`
        prevTranslate.current = currentTranslate.current
      } else if (idx >= len) {
        currentIndex.current = idx - len
        currentTranslate.current = -currentIndex.current * unit
        track.style.transition = "none"
        track.style.transform = `translate3d(${currentTranslate.current}px, 0, 0)`
        prevTranslate.current = currentTranslate.current
      }
    }

    track.addEventListener("transitionend", onTransitionEnd)
    return () => track.removeEventListener("transitionend", onTransitionEnd)
  }, [images.length, slideWidth, GAP])

  const setTransform = (x: number, animate: boolean) => {
    if (!trackRef.current) return
    trackRef.current.style.transition = animate
      ? "transform 600ms cubic-bezier(.25,.1,.25,1)"
      : "none"
    trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`
  }

  const animateLoop = () => {
    setTransform(currentTranslate.current, false)
    if (isDragging.current) {
      animationRef.current = requestAnimationFrame(animateLoop)
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    prevTranslate.current = currentTranslate.current
    containerRef.current?.setPointerCapture(e.pointerId)
    animationRef.current = requestAnimationFrame(animateLoop)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - startX.current
    currentTranslate.current = prevTranslate.current + dx
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    const unit = slideWidth + GAP
    const rawIdx = -currentTranslate.current / unit
    let idx = Math.round(rawIdx)

    const minIdx = -clones
    const maxIdx = images.length - 1 + clones
    idx = Math.max(minIdx, Math.min(maxIdx, idx))

    currentIndex.current = idx
    currentTranslate.current = -idx * unit
    setTransform(currentTranslate.current, true)

    try {
      containerRef.current?.releasePointerCapture(e.pointerId)
    } catch (_) {}
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ userSelect: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          gap: `${GAP}px`,
          willChange: "transform",
        }}
      >
        {extended.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 overflow-hidden"
            style={{ width: slideWidth || "100%" }}
          >
            <div className="h-[300px] overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="object-cover w-full h-full pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
