import LocalizedClientLink from "@modules/common/components/localized-client-link"

const faqs = [
  {
    question: "How do I place an order?",
    answer: (
      <>
        Explore the{" "}
        <LocalizedClientLink href="/store" className="underline">
          shop
        </LocalizedClientLink>
        , choose your products and options, then add them to your bag. Checkout
        will show the available delivery methods and payment options for your
        order.
      </>
    ),
  },
  {
    question: "Where can I find my order details?",
    answer: (
      <>
        Sign in to your{" "}
        <LocalizedClientLink href="/account/orders" className="underline">
          account
        </LocalizedClientLink>{" "}
        to see your order history, items and fulfilment status. If you checked
        out as a guest, refer to your confirmation or contact us with your order
        number.
      </>
    ),
  },
  {
    question: "How much does delivery cost?",
    answer: (
      <>
        Available delivery methods and their prices are calculated at checkout
        using your address and bag. You can review the full total before placing
        your order.
      </>
    ),
  },
  {
    question: "Can I check ingredients or allergens before ordering?",
    answer: (
      <>
        Check the product description for available details. If you have a
        dietary requirement or need to confirm ingredients or cross-contact
        information, send us the product name before placing your order.
      </>
    ),
  },
  {
    question: "Can I change an order I’ve already placed?",
    answer: (
      <>
        Contact us with your order number and the change you’d like to make.
        We’ll check the order status and let you know what is possible.
      </>
    ),
  },
  {
    question: "How do I update my details?",
    answer: (
      <>
        You can update your name, phone number and saved addresses in{" "}
        <LocalizedClientLink href="/account" className="underline">
          your account
        </LocalizedClientLink>
        . Saved addresses make your next checkout easier.
      </>
    ),
  },
]
export default function FaqSection() {
  return (
    <section
      id="faq"
      className="grid small:grid-cols-[.8fr_1.2fr] gap-10 small:gap-20 border-t border-[#e2e4dc] pt-16"
    >
      <div>
        <p className="eyebrow mb-4">A few helpful answers</p>
        <h2 className="section-heading">Good to know.</h2>
        <p className="page-description mt-5">
          A little help with shopping, your account and everything in between.
        </p>
      </div>
      <div>
        {faqs.map((faq, i) => (
          <details key={i} className="group border-b border-[#e2e4dc] py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-medium [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                className="text-xl font-normal group-open:rotate-45 transition-transform"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="text-sm leading-7 text-[#73766c] pt-4 pr-7">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
