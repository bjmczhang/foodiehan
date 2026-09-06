import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
type ProductTabsProps = { product: HttpTypes.StoreProduct }
const metadataText = (value: unknown) =>
  typeof value === "string"
    ? value
    : Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value.join(", ")
    : null
export default function ProductTabs({ product }: ProductTabsProps) {
  const ingredients = metadataText(product.metadata?.ingredients)
  const allergens = metadataText(product.metadata?.allergens)
  const details = [
    {
      title: "Product details",
      content: (
        <div className="space-y-3">
          {product.weight ? <p>Weight: {product.weight} g</p> : null}
          {product.origin_country && (
            <p>Country of origin: {product.origin_country.toUpperCase()}</p>
          )}
          {ingredients && <p>Ingredients: {ingredients}</p>}
          <p>
            Choose your preferred options above. If you need more information
            about ingredients or sizing, our team can help.
          </p>
        </div>
      ),
    },
    {
      title: "Ingredients & allergens",
      content: (
        <div className="space-y-3">
          {allergens ? (
            <p>Allergen information: {allergens}</p>
          ) : (
            <p>
              For the ingredient list and allergen information for this item,
              please check the product label or contact our team before
              ordering.
            </p>
          )}
          <LocalizedClientLink href="/contact" className="text-link">
            Ask about this product
          </LocalizedClientLink>
        </div>
      ),
    },
    {
      title: "Your order",
      content: (
        <p>
          Available delivery or collection methods, charges, and your final
          order total are shown at checkout. You can review your order in your
          account after purchase.
        </p>
      ),
    },
  ]
  return (
    <div className="border-t border-[#e2e4dc]">
      {details.map((detail) => (
        <details
          key={detail.title}
          className="group border-b border-[#e2e4dc] py-1"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
            {detail.title}
            <span
              aria-hidden="true"
              className="text-xl font-normal transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="text-sm leading-7 text-[#73766c] pb-5 pr-5">
            {detail.content}
          </div>
        </details>
      ))}
    </div>
  )
}
