import { VariantPrice } from "types/global"
export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) return null
  return (
    <>
      {price.price_type === "sale" && (
        <span
          className="line-through text-[#73766c]"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span className="text-[#323c2b]" data-testid="price">
        {price.calculated_price}
      </span>
    </>
  )
}
