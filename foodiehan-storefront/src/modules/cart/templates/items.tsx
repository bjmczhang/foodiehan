import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
const ItemsTemplate = ({ cart }: { cart?: HttpTypes.StoreCart }) => (
  <div>
    <div className="flex items-center justify-between border-b border-[#e2e4dc] pb-5 text-xs font-medium uppercase tracking-[0.16em] text-[#73766c]">
      <h2>Your selection</h2>
      <span>Total</span>
    </div>
    <div className="divide-y divide-[#e2e4dc]">
      {[...(cart?.items ?? [])]
        .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
        .map((item) => (
          <Item key={item.id} item={item} currencyCode={cart!.currency_code} />
        ))}
    </div>
  </div>
)
export default ItemsTemplate
