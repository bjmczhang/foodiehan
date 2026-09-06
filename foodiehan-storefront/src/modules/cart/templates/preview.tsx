import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
const ItemsPreviewTemplate = ({ cart }: { cart: HttpTypes.StoreCart }) => (
  <div
    className="max-h-[460px] overflow-y-auto divide-y divide-[#e2e4dc]"
    data-testid="items-table"
  >
    {[...(cart.items ?? [])]
      .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
      .map((item) => (
        <Item
          key={item.id}
          item={item}
          type="preview"
          currencyCode={cart.currency_code}
        />
      ))}
  </div>
)
export default ItemsPreviewTemplate
