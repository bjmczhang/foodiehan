"use client"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useEffect, useState } from "react"
import { sanitizeImageUrl } from "@lib/util/sanitize-image-url"
type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title?: string
  thumbnail?: string | null
}
export default function ImageGallery({
  images,
  title = "Product",
  thumbnail,
}: ImageGalleryProps) {
  const urls = images
    .map((image) => sanitizeImageUrl(image.url))
    .filter((url): url is string => !!url)
  if (!urls.length && thumbnail)
    urls.push(sanitizeImageUrl(thumbnail) || thumbnail)
  const [activeIndex, setActiveIndex] = useState(0)
  const imageKey = urls.join("|")
  useEffect(() => setActiveIndex(0), [imageKey])
  const activeUrl = urls[Math.min(activeIndex, urls.length - 1)]
  const move = (step: number) =>
    setActiveIndex((current) => (current + step + urls.length) % urls.length)
  return (
    <div className="w-full">
      <div
        className="relative aspect-square rounded-[24px] bg-[#eeeee8] overflow-hidden"
        role="region"
        aria-label={`${title} images`}
      >
        {activeUrl ? (
          <Image
            src={activeUrl}
            alt={`${title}, image ${activeIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 50vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[#73766c]">
            Image coming soon
          </div>
        )}
        {urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 w-11 h-11 flex items-center justify-center hover:bg-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 w-11 h-11 flex items-center justify-center hover:bg-white"
            >
              →
            </button>
            <span className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-full text-xs">
              {activeIndex + 1} / {urls.length}
            </span>
          </>
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-4">
          {urls.map((url, index) => (
            <button
              type="button"
              key={`${url}-${index}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${title}`}
              aria-pressed={index === activeIndex}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 ${
                index === activeIndex
                  ? "border-[#323c2b]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
