import { Metadata } from "next"
import PolicyTemplate, { PolicySection } from "@modules/legal/templates/policy-template"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | FoodieHan",
  description:
    "Everything you need to know about FoodieHan's Sydney delivery zones, rates, order cut-offs, fresh packaging, and collection options.",
}

export default async function ShippingPolicyPage() {
  const sections: PolicySection[] = [
    {
      title: "1. Freshness First: How We Deliver",
      content: (
        <>
          <p>
            At FoodieHan, our mission is to deliver bakes and specialty foods that taste as wonderful on your kitchen counter as they did fresh out of our ovens. Because artisan breads and filled buns are perishable, our delivery schedules and packaging are designed specifically for freshness.
          </p>
          <p>
            We operate scheduled delivery routes across the <strong>Sydney Metropolitan area</strong>.
          </p>
        </>
      ),
    },
    {
      title: "2. Delivery Rates & Options",
      content: (
        <>
          <p>
            During checkout, available delivery options for your postcode are shown transparently before payment:
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-left border-collapse border border-[#e2e4dc]">
              <thead>
                <tr className="bg-[#f0f2e9] text-[#272b24]">
                  <th className="p-3 border border-[#e2e4dc] font-medium">Option</th>
                  <th className="p-3 border border-[#e2e4dc] font-medium">Estimated Timeframe</th>
                  <th className="p-3 border border-[#e2e4dc] font-medium">Cost (AUD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-[#e2e4dc] font-medium">Standard Delivery (Sydney Metro)</td>
                  <td className="p-3 border border-[#e2e4dc]">1 to 2 business days</td>
                  <td className="p-3 border border-[#e2e4dc]">$10.00</td>
                </tr>
                <tr>
                  <td className="p-3 border border-[#e2e4dc] font-medium">Express Delivery (Next Day)</td>
                  <td className="p-3 border border-[#e2e4dc]">Priority next-day dispatch</td>
                  <td className="p-3 border border-[#e2e4dc]">$18.00</td>
                </tr>
                <tr>
                  <td className="p-3 border border-[#e2e4dc] font-medium">Kitchen / Store Collection</td>
                  <td className="p-3 border border-[#e2e4dc]">Ready at scheduled pick-up window</td>
                  <td className="p-3 border border-[#e2e4dc]">FREE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#73766c]">
            * Delivery rates are flat rates in Australian Dollars (AUD), inclusive of GST.
          </p>
        </>
      ),
    },
    {
      title: "3. Order Cut-Off Times & Dispatch",
      content: (
        <>
          <p>
            To ensure dough fermentation and baking schedules align with dispatch:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Daily Cut-Off:</strong> Orders placed before <strong>2:00 PM AEST</strong> are scheduled for next baking cycle and earliest dispatch window.
            </li>
            <li>
              <strong>Weekend &amp; Public Holidays:</strong> Orders placed over the weekend or on public holidays are baked and dispatched on the subsequent business day.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Packaging & Temperature Management",
      content: (
        <>
          <p>
            We take pride in using sustainable, eco-friendly food packaging designed to protect delicate crusts and textures during transit:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Artisan Breads &amp; Pastries:</strong> Packaged in breathable, food-grade bakery bags and sturdy outer boxes to prevent crushing.
            </li>
            <li>
              <strong>Chilled &amp; Fresh Cream Items:</strong> Packed with protective insulation and food-safe chill packs during warmer months to maintain safe temperatures during transit.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "5. Delivery Instructions & Authority to Leave (ATL)",
      content: (
        <>
          <p>
            Due to the perishable nature of our products, we strongly recommend having someone available at the delivery address to receive the goods.
          </p>
          <p>
            If no one is available to sign or accept delivery, the driver will follow your provided delivery instructions (such as &ldquo;leave in shaded porch&rdquo; or &ldquo;leave with concierge&rdquo;). If no specific notes are provided, the courier will leave the package in the safest, sheltered location accessible.
          </p>
          <p>
            Once left at the premises, responsibility for safeguarding the items from heat, sun exposure, and pets passes to the customer.
          </p>
        </>
      ),
    },
    {
      title: "6. Tracking Your Order",
      content: (
        <>
          <p>
            Once your order has been packed and handed over to our delivery team, you will receive a dispatch notification email with delivery updates. You can also monitor your order status anytime through your{" "}
            <LocalizedClientLink href="/account/orders" className="underline text-[#46523b]">
              Order History
            </LocalizedClientLink>
            .
          </p>
        </>
      ),
    },
  ]

  return (
    <PolicyTemplate
      badge="Logistics & Care"
      title="Shipping & Delivery Policy"
      subtitle="How your bakes make their journey from our ovens to your front door."
      sections={sections}
    />
  )
}

