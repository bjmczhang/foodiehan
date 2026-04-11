import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

export default async function PricingList({
  region,
}: {
  region?: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region?.id,
    queryParams: {
      limit: 6,
      fields: "id,title,subtitle,variants,description",
    },
  })

  const items = (products || []).slice(0, 4)

  return (
    <div id="menu" className="py-12 content-container small:py-24">
      <div className="max-w-[1100px] mx-auto">
        <h3 className="mb-6 text-3xl font-semibold">Our Menu</h3>

        <div className="grid grid-cols-1 gap-6 small:grid-cols-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between pb-4 border-b border-dotted border-ui-border-base"
            >
              <div className="pr-4">
                <div className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {p.title}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  {(p as any).subtitle || (p as any).description || ""}
                </div>
              </div>
              <div className="text-lg font-semibold text-[var(--color-brand)] whitespace-nowrap">
                {p.variants && p.variants.length > 0
                  ? `$${(p.variants[0].calculated_price / 100).toFixed(2)}`
                  : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
