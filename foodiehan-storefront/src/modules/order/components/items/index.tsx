import { HttpTypes } from "@medusajs/types"
import Item from "@modules/order/components/item"

const Items = ({ order }: { order: HttpTypes.StoreOrder }) => (
  <div className="divide-y divide-[#e2e4dc]" data-testid="products-table">
    {order.items?.length ? (
      [...order.items]
        .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
        .map((item) => (
          <Item key={item.id} item={item} currencyCode={order.currency_code} />
        ))
    ) : (
      <p className="py-5 text-sm text-[#73766c]">
        Item details are not available for this order.
      </p>
    )}
  </div>
)
export default Items
