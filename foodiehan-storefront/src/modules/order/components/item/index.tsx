import { HttpTypes } from "@medusajs/types"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

const Item = ({
  item,
  currencyCode,
}: {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}) => (
  <div
    className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
    data-testid="product-row"
  >
    <div className="w-16 shrink-0 sm:w-20">
      <Thumbnail thumbnail={item.thumbnail} size="square" />
    </div>
    <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-6" data-testid="product-name">
          {item.product_title || item.title}
        </p>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
        <p className="mt-2 text-xs text-[#73766c]">
          Quantity <span data-testid="product-quantity">{item.quantity}</span>
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 text-sm">
        <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
        <div className="text-xs text-[#73766c]">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
          <span className="ml-1">each</span>
        </div>
      </div>
    </div>
  </div>
)
export default Item
