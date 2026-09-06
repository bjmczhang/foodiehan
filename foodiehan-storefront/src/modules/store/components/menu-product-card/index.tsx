import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
export default function MenuProductCard({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  return <ProductPreview product={product} />
}
