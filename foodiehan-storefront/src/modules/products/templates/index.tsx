import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductInfo from "@modules/products/templates/product-info"
import RelatedProducts from "@modules/products/components/related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="content-container max-w-[1440px] mx-auto px-6 pt-28 sm:pt-36 pb-16">
        {/* ── Two-column layout matching Image 1 ──────────── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Left: Image gallery */}
          <div className="w-full lg:w-[55%]">
            <ImageGallery images={images} />
          </div>

          {/* Right: Product info + Accordions + Actions matching Image 1 */}
          <div className="w-full lg:w-[45%] flex flex-col pt-2 lg:pt-0">
            {/* 1. Title, Price, Divider, Description */}
            <ProductInfo product={product} />

            {/* 2. Accordions (Sizing, Allergen, Pricing) BEFORE order actions */}
            <ProductTabs product={product} />

            {/* 3. Options (Size) & ORDER NOW Button */}
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        </div>

        {/* ── 'You may also like' Section matching Image 2 ── */}
        <Suspense fallback={null}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
