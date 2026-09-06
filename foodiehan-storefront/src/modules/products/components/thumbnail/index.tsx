import { clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { sanitizeImageUrl } from "@lib/util/sanitize-image-url"
type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  alt?: string
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}
const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  alt = "Product",
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestId,
}) => {
  const initialImage = sanitizeImageUrl(thumbnail || images?.[0]?.url)
  return (
    <div
      className={clx(
        "relative overflow-hidden bg-[#eeeee8] rounded-2xl",
        {
          "aspect-[4/5]": isFeatured,
          "aspect-square": !isFeatured,
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full" || size === "square",
        },
        className
      )}
      data-testid={dataTestId}
    >
      {initialImage ? (
        <Image
          src={initialImage}
          alt={alt}
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          draggable={false}
          quality={80}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 40vw, 300px"
          fill
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[#a1a497]">
          <PlaceholderImage size={size === "small" ? 16 : 32} />
        </div>
      )}
    </div>
  )
}
export default Thumbnail
