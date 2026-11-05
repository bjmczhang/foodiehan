import { Metadata } from "next"
import PolicyTemplate, { PolicySection } from "@modules/legal/templates/policy-template"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Privacy Policy | FoodieHan",
  description:
    "Learn how FoodieHan collects, uses, and safeguards your personal information in compliance with the Australian Privacy Principles (APPs).",
}

export default async function PrivacyPage() {
  const sections: PolicySection[] = [
    {
      title: "1. Commitment to Privacy",
      content: (
        <>
          <p>
            FoodieHan (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is dedicated to protecting the privacy of your personal information. We operate in compliance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs), which set the standards for how personal information is collected, stored, used, and disclosed.
          </p>
          <p>
            This Privacy Policy explains what personal information we collect, why we collect it, how it is handled, and how you can exercise your rights regarding your data.
          </p>
        </>
      ),
    },
    {
      title: "2. Personal Information We Collect",
      content: (
        <>
          <p>
            When you interact with our website or place an order, we may collect information necessary to fulfill your request, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Contact &amp; Delivery Details:</strong> Your name, delivery address, billing address, email address, and contact phone number.
            </li>
            <li>
              <strong>Order &amp; Purchase History:</strong> Details of the bakery and grocery items you have ordered, delivery preferences, and order notes.
            </li>
            <li>
              <strong>Account Information:</strong> Account credentials, login activity, and saved addresses if you register a FoodieHan customer account.
            </li>
            <li>
              <strong>Technical &amp; Usage Data:</strong> IP address, device type, browser information, pages viewed, and interaction timestamps collected via essential cookies to provide shopping cart and session functionality.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "3. How We Use Your Information",
      content: (
        <>
          <p>
            We collect and use your personal information solely for legitimate business purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Processing, packing, and delivering your food orders accurately and on schedule.</li>
            <li>Sending order confirmations, dispatch alerts, and digital receipts.</li>
            <li>Responding promptly to customer service queries and dietary/allergen enquiries.</li>
            <li>Preventing fraudulent transactions and ensuring website security.</li>
            <li>With your express consent, sending occasional updates about seasonal bakes and special offers (from which you can unsubscribe at any time).</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Payment Security & PCI-DSS Compliance",
      content: (
        <>
          <p>
            Your financial security is paramount. Online payments on FoodieHan are processed through certified, PCI-DSS Level 1 compliant payment gateways (such as Stripe).
          </p>
          <p>
            FoodieHan does not store, capture, or have access to your full credit card numbers or security CVV codes. Sensitive payment information is encrypted and transmitted directly between your browser and the payment provider.
          </p>
        </>
      ),
    },
    {
      title: "5. Sharing of Personal Information",
      content: (
        <>
          <p>
            We will never sell, rent, or trade your personal information to third parties for marketing purposes. We only share information with trusted service partners strictly as needed to operate our store:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Delivery &amp; Logistics Partners:</strong> Local Sydney couriers and dispatch drivers who require your name, address, and phone number to complete delivery.
            </li>
            <li>
              <strong>Technology Infrastructure:</strong> Cloud hosting, database, and email delivery providers operating under strict security agreements.
            </li>
            <li>
              <strong>Legal Compliance:</strong> Government or regulatory authorities only when required by Australian law.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "6. Data Security & Retention",
      content: (
        <>
          <p>
            We take reasonable administrative, technical, and physical measures to safeguard your personal information against misuse, interference, loss, unauthorized access, modification, or disclosure.
          </p>
          <p>
            All website communications are secured using modern Transport Layer Security (TLS/HTTPS). We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, or to comply with applicable Australian taxation and accounting regulations.
          </p>
        </>
      ),
    },
    {
      title: "7. Your Rights & Access to Your Information",
      content: (
        <>
          <p>
            Under the Australian Privacy Principles, you have the right to request access to the personal information we hold about you and to ask for corrections if you believe it is inaccurate, incomplete, or out-of-date.
          </p>
          <p>
            You may also update your saved addresses and contact details directly within your{" "}
            <LocalizedClientLink href="/account" className="underline text-[#46523b]">
              Account Dashboard
            </LocalizedClientLink>
            .
          </p>
        </>
      ),
    },
    {
      title: "8. Privacy Inquiries & Complaints",
      content: (
        <>
          <p>
            If you have questions about our privacy practices, wish to access or update your information, or want to lodge a privacy complaint, please contact our team via our{" "}
            <LocalizedClientLink href="/contact" className="underline text-[#46523b]">
              Contact Form
            </LocalizedClientLink>{" "}
            or email privacy@foodiehan.com.au.
          </p>
          <p>
            We take all concerns seriously and will investigate and respond to any complaints in writing within 30 business days.
          </p>
        </>
      ),
    },
  ]

  return (
    <PolicyTemplate
      badge="Privacy & Trust"
      title="Privacy Policy"
      subtitle="How we respect, protect, and handle your personal information in accordance with Australian standards."
      sections={sections}
    />
  )
}

