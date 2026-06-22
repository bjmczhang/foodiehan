"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return (
      <div className="flex items-center justify-center w-full bg-[#f5f5f5]" style={{ aspectRatio: "1/1" }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" fill="#e5e5e5" />
          <path d="M14 34l8-10 6 7 4-5 6 8H14z" fill="#cccccc" />
          <circle cx="32" cy="18" r="4" fill="#cccccc" />
        </svg>
      </div>
    )
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "1/1" }}>
        {images[activeIndex]?.url && (
          <Image
            src={images[activeIndex].url}
            alt={`Product image ${activeIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority={activeIndex === 0}
          />
        )}

        {/* Prev/Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className="relative flex-shrink-0 overflow-hidden transition-opacity duration-200"
              style={{
                width: 64,
                height: 64,
                opacity: index === activeIndex ? 1 : 0.5,
                outline: index === activeIndex ? "1px solid var(--color-brand)" : "1px solid transparent",
                outlineOffset: 2,
              }}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
