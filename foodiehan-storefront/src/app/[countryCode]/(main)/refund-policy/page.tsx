import { Metadata } from "next"
import PolicyTemplate, { PolicySection } from "@modules/legal/templates/policy-template"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Refund & Returns Policy | FoodieHan",
  description:
    "Review FoodieHan's Refund and Returns Policy. Learn about our fresh food guarantee, cancellation terms, and consumer rights under Australian Consumer Law.",
}

export default async function RefundPolicyPage() {
  const sections: PolicySection[] = [
    {
      title: "1. Fresh Food & Satisfaction Guarantee",
      content: (
        <>
          <p>
            At FoodieHan, we take immense pride in the craftsmanship, taste, and freshness of our artisan breads, Korean-inspired buns, and specialty culinary products. Every item is baked and prepared with meticulous care.
          </p>
          <p>
            Because we prepare freshly baked and perishable food items, standard retail &ldquo;change of mind&rdquo; returns are not permitted once goods have entered the baking queue or have been dispatched. However, your complete satisfaction is our highest priority, and we stand firmly behind the quality of everything we make.
          </p>
        </>
      ),
    },
    {
      title: "2. Australian Consumer Law (ACL) Statutory Rights",
      content: (
        <>
          <p>
            Our products come with guarantees that cannot be excluded under the Australian Consumer Law (ACL). You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage.
          </p>
          <p>
            You are also entitled to have the goods replaced or refunded if the goods fail to be of acceptable quality and the failure does not amount to a major failure. Nothing in this policy restricts or overrides your statutory consumer rights.
          </p>
        </>
      ),
    },
    {
      title: "3. Damaged, Defective, or Incorrect Items",
      content: (
        <>
          <p>
            While we take every precaution to ensure your order arrives in pristine condition, transit mishaps occasionally occur. If an item arrives damaged, spoiled, past its prime, or different from what you ordered:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Notify Us Promptly:</strong> Please contact us within <strong>24 hours</strong> of receiving your delivery or collecting your order. Due to the perishable nature of bakery goods, timely notification ensures we can properly assess the issue.
            </li>
            <li>
              <strong>Provide Details:</strong> Include your order reference number, a brief explanation of the problem, and clear photographs showing the affected item and packaging.
            </li>
            <li>
              <strong>Our Resolution:</strong> Once verified, we will gladly offer your choice of an immediate replacement bake (subject to schedule), store credit voucher, or a prompt refund to your original payment method.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Order Cancellations & Changes",
      content: (
        <>
          <p>
            Because our bakers begin preparing doughs and ingredients well in advance:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Cancellations:</strong> You may cancel or amend your order free of charge up to <strong>24 hours prior</strong> to the scheduled delivery date or collection window.
            </li>
            <li>
              <strong>Late Requests:</strong> If a cancellation request is received within 24 hours of baking or dispatch, we may be unable to cancel or refund the order as custom ingredients will already have been committed.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "5. Refund Processing Times",
      content: (
        <>
          <p>
            Approved refunds are initiated immediately to your original payment method. Please note that credit card processors and banks typically take between <strong>3 to 7 business days</strong> to post the funds back into your account.
          </p>
          <p>
            If you have not received an approved refund after 10 business days, please check with your financial institution and reach out to us for transaction verification.
          </p>
        </>
      ),
    },
    {
      title: "6. How to Request Assistance",
      content: (
        <>
          <p>
            To lodge a claim or discuss an order issue, please contact our support team:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Via our website:{" "}
              <LocalizedClientLink href="/contact" className="underline text-[#46523b]">
                Contact Us Form
              </LocalizedClientLink>
            </li>
            <li>Direct Email: refunds@foodiehan.com.au / support@foodiehan.com.au</li>
            <li>Response Time: Typically within 2 to 4 business hours on trading days</li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <PolicyTemplate
      badge="Customer Care"
      title="Refund & Returns Policy"
      subtitle="Clear, fair, and consumer-focused guidelines for our fresh bakes and culinary products."
      sections={sections}
    />
  )
}

