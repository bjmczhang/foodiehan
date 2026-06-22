import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductInfo from "@modules/products/templates/product-info"
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
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8 small:py-12">
        {/* ── Two-column layout ────────────────────────────── */}
        <div className="flex flex-col small:flex-row gap-8 small:gap-14">
          {/* Left: Image gallery */}
          <div className="w-full small:w-[55%]">
            <ImageGallery images={images} />
          </div>

          {/* Right: Product info + actions */}
          <div className="w-full small:w-[45%] flex flex-col gap-y-8">
            <ProductInfo product={product} />
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
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
