import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductInfo from "@modules/products/templates/product-info"
import RelatedProducts from "@modules/products/components/related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
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
  if (!product?.id) return notFound()
  return (
    <div className="page-shell">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-3 text-xs text-[#73766c] mb-8"
      >
        <LocalizedClientLink href="/" className="hover:text-[#323c2b]">
          Home
        </LocalizedClientLink>
        <span aria-hidden="true">/</span>
        <LocalizedClientLink href="/store" className="hover:text-[#323c2b]">
          Shop
        </LocalizedClientLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-[#272b24]">
          {product.title}
        </span>
      </nav>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <ImageGallery
            images={images}
            title={product.title || "Product"}
            thumbnail={product.thumbnail}
          />
        </div>
        <div className="lg:py-4">
          <ProductInfo product={product} />
          <div className="mt-7 mb-8">
            <Suspense
              fallback={
                <ProductActions disabled product={product} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
          <ProductTabs product={product} />
          <p className="text-sm text-[#73766c] mt-6">
            A question about this product?{" "}
            <LocalizedClientLink href="/contact" className="text-link">
              We’re happy to help.
            </LocalizedClientLink>
          </p>
        </div>
      </div>
      <Suspense fallback={null}>
        <RelatedProducts product={product} countryCode={countryCode} />
      </Suspense>
    </div>
  )
}
export default ProductTemplate
