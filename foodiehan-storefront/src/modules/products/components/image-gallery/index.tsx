"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"
import { sanitizeImageUrl } from "@lib/util/sanitize-image-url"

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

  const activeUrl = sanitizeImageUrl(images[activeIndex]?.url)

  return (
    <div className="w-full flex flex-col">
      {/* Main image */}
      <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden mb-6">
        {activeUrl && (
          <Image
            src={activeUrl}
            alt={`Product image ${activeIndex + 1}`}
            fill
            className="object-contain p-4 sm:p-8 transition-all duration-300"
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/70 hover:bg-white text-[#333] hover:text-black rounded-full transition-all duration-200"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/70 hover:bg-white text-[#333] hover:text-black rounded-full transition-all duration-200"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-2 pb-4">
          {images.map((image, index) => {
            const thumbUrl = sanitizeImageUrl(image.url)
            const isActive = index === activeIndex
            return (
              <div key={image.id} className="flex flex-col items-center flex-shrink-0">
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-white overflow-hidden transition-all duration-200 ${
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {thumbUrl && (
                    <Image
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  )}
                </button>
                {/* Active underline bar matching Image 1 */}
                <div
                  className={`h-[2px] w-full mt-1.5 transition-all duration-200 ${
                    isActive ? "bg-black" : "bg-transparent"
                  }`}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
