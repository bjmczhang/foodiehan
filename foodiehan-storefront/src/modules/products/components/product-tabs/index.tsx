"use client"

import { HttpTypes } from "@medusajs/types"
import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Allergen Information",
      component: <AllergenInfoTab />,
    },
    {
      label: "Pickup & Availability",
      component: <PickupInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-sm leading-relaxed py-6 space-y-4" style={{ color: "var(--color-text-secondary)" }}>
      <p>
        Our products are handcrafted daily using the finest ingredients. For
        detailed ingredient lists, please refer to the product label or speak
        with our team in-store.
      </p>
      {product.weight && (
        <p>
          <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Weight: </span>
          {product.weight}g
        </p>
      )}
      {product.origin_country && (
        <p>
          <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Made in: </span>
          {product.origin_country}
        </p>
      )}
    </div>
  )
}

const AllergenInfoTab = () => {
  return (
    <div className="text-sm leading-relaxed py-6 space-y-4" style={{ color: "var(--color-text-secondary)" }}>
      <p>
        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Contains: </span>
        Cereals (Gluten), Egg, Milk, Soy, Tree Nuts, Sulphites.
      </p>
      <p>
        Our bakery handles nuts, flour (gluten), dairy, eggs, and soy on a daily
        basis. While we take care to prevent cross-contamination, we cannot
        guarantee that any product is completely free of allergens.
      </p>
      <p>
        If you have a specific allergy or dietary requirement, please speak with
        our team before placing your order.
      </p>
    </div>
  )
}

const PickupInfoTab = () => {
  return (
    <div className="text-sm leading-relaxed py-6 space-y-4" style={{ color: "var(--color-text-secondary)" }}>
      <p>
        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Pickup: </span>
        Orders can be picked up from our Sydney bakery during opening hours.
        Please allow at least 24 hours for your order to be prepared.
      </p>
      <p>
        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Delivery: </span>
        We offer delivery via Uber Eats and DoorDash across Sydney metro areas.
        You can also order pickup directly from our online order page.
      </p>
      <p>
        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Dine-in: </span>
        A 10% dine-in surcharge applies to individual items on weekends.
      </p>
    </div>
  )
}

export default ProductTabs
