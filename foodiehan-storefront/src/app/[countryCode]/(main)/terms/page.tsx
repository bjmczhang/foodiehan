import { Metadata } from "next"
import PolicyTemplate, { PolicySection } from "@modules/legal/templates/policy-template"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Terms of Service | FoodieHan",
  description:
    "Read the Terms of Service for FoodieHan. Learn about our ordering process, payment terms, delivery conditions, and consumer rights in Australia.",
}

export default async function TermsPage() {
  const sections: PolicySection[] = [
    {
      title: "1. About FoodieHan & Acceptance of Terms",
      content: (
        <>
          <p>
            Welcome to FoodieHan (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We operate the online bakery and specialty food store at foodiehan.com.au. By accessing our website, registering an account, or placing an order, you agree to be bound by these Terms of Service.
          </p>
          <p>
            These terms apply to all users of the site, including customers, browsers, and vendors. Please review them carefully before making a purchase. If you do not agree to all terms and conditions, you may not access the website or use our ordering services.
          </p>
        </>
      ),
    },
    {
      title: "2. Orders & Fresh Food Availability",
      content: (
        <>
          <p>
            All products displayed on our website, including artisan breads, buns, pastries, and Asian specialty items, are subject to availability. Because our baked goods are freshly crafted, daily production quantities may be limited.
          </p>
          <p>
            When you place an order, you will receive an automated order confirmation email with your order summary. This confirmation acknowledges that we have received your order request. We reserve the right to accept or decline your order in whole or in part (for example, in the unlikely event of an unexpected ingredient shortage or equipment malfunction). If we cannot fulfill an item, we will contact you immediately to offer a suitable replacement or a full refund.
          </p>
        </>
      ),
    },
    {
      title: "3. Pricing, Taxes & Payment",
      content: (
        <>
          <p>
            All prices on our website are stated in Australian Dollars (AUD) and are inclusive of Australian Goods and Services Tax (GST) where applicable. Delivery and shipping fees are calculated and clearly shown during the checkout process before payment confirmation.
          </p>
          <p>
            We accept approved online payment methods including major credit/debit cards processed through secure, PCI-DSS compliant payment gateways, as well as designated manual payment options. You agree to provide accurate and complete billing information. If a payment cannot be verified or is declined, your order will not be processed.
          </p>
        </>
      ),
    },
    {
      title: "4. Perishable Nature of Goods & Storage",
      content: (
        <>
          <p>
            Our artisan breads, filled buns, cakes, and pastries are freshly baked without artificial preservatives. Consequently, they are perishable and designed to be enjoyed fresh.
          </p>
          <p>
            Upon delivery or collection, it is the customer&rsquo;s responsibility to inspect and properly store the items according to provided guidance (e.g., refrigerating cream or custard-filled buns, or freezing sliced loaves for extended freshness). We cannot be held liable for food deterioration resulting from improper storage after successful handover or delivery.
          </p>
        </>
      ),
    },
    {
      title: "5. Delivery & Customer Responsibilities",
      content: (
        <>
          <p>
            We deliver within designated Sydney Metropolitan zones as outlined in our{" "}
            <LocalizedClientLink href="/shipping-policy" className="underline text-[#46523b]">
              Shipping &amp; Delivery Policy
            </LocalizedClientLink>
            . You are responsible for ensuring that the delivery address provided is accurate, complete, and accessible.
          </p>
          <p>
            If no one is available to receive the delivery and safe drop instructions were provided or an authority to leave was given, the courier will leave the goods in a secure, sheltered location at your doorstep. Risk of loss or spoilage passes to you upon delivery.
          </p>
        </>
      ),
    },
    {
      title: "6. Australian Consumer Law (ACL) Guarantees",
      content: (
        <>
          <p>
            Our goods come with guarantees that cannot be excluded under the Australian Consumer Law (ACL), Schedule 2 of the Competition and Consumer Act 2010 (Cth). Nothing in these Terms of Service purports to exclude, restrict, or modify any statutory consumer rights that cannot be excluded by law.
          </p>
          <p>
            For major failures with the service or product, you are entitled to cancel your service contract with us and to a refund for the unused portion, or to a replacement for products that are defective, damaged, or not of acceptable quality. For details on how to make a claim, please refer to our{" "}
            <LocalizedClientLink href="/refund-policy" className="underline text-[#46523b]">
              Refund &amp; Returns Policy
            </LocalizedClientLink>
            .
          </p>
        </>
      ),
    },
    {
      title: "7. User Accounts & Security",
      content: (
        <>
          <p>
            When you create an account with FoodieHan, you must provide true, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for restricting access to your computer or mobile device.
          </p>
          <p>
            You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
        </>
      ),
    },
    {
      title: "8. Governing Law & Contact",
      content: (
        <>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts of New South Wales.
          </p>
          <p>
            For any questions regarding these Terms, please reach out via our{" "}
            <LocalizedClientLink href="/contact" className="underline text-[#46523b]">
              Contact Page
            </LocalizedClientLink>{" "}
            or email us at support@foodiehan.com.au.
          </p>
        </>
      ),
    },
  ]

  return (
    <PolicyTemplate
      badge="Legal & Terms"
      title="Terms of Service"
      subtitle="The principles, policies, and mutual agreements that guide every order with FoodieHan."
      sections={sections}
    />
  )
}

