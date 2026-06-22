"use client"

import { useState } from "react"

type FaqItem = {
  question: string
  answer: string | React.ReactNode
}

const faqs: FaqItem[] = [
  {
    question: "Ingredients & nutrition info",
    answer: (
      <>
        You can find detailed ingredient lists and nutritional information on
        each product&apos;s description page. Browse our{" "}
        <a href="/store" className="text-[var(--color-brand)] hover:underline">
          product range
        </a>{" "}
        to learn more. If you still have questions, feel free to send us an
        enquiry using the form above.
      </>
    ),
  },
  {
    question: "How do I order a cake?",
    answer: (
      <>
        You can place cake orders in-store at our Sydney bakery, or order online
        through our{" "}
        <a
          href="/online-order"
          className="text-[var(--color-brand)] hover:underline"
        >
          online order page
        </a>
        . We offer a range of celebration cakes, custom designs, and Asian-style
        creations.
      </>
    ),
  },
  {
    question: "How much notice do you need for custom cakes?",
    answer:
      "We typically require 3 days notice for custom cake orders. For larger events or elaborate designs, we recommend reaching out at least a week in advance so we can discuss your vision and ensure every detail is perfect.",
  },
  {
    question: "When is your bread baked?",
    answer:
      "Our bread is baked fresh every morning — our ovens run from the early hours to ensure that every loaf, roll, and pastry is at its best when our doors open. We bake throughout the day in smaller batches to keep the shelves full and fresh.",
  },
  {
    question: "Is your facility allergen-free?",
    answer:
      "No — our bakery handles nuts, flour (gluten), dairy, eggs, and soy on a daily basis. While we take care to prevent cross-contamination, we cannot guarantee that any product is completely free of allergens. Please check individual product pages for specific allergen details or speak with our team in-store.",
  },
  {
    question: "Do you offer gift vouchers?",
    answer:
      "Yes! Gift vouchers are available for purchase and redemption in-store. They make the perfect gift for the food lover in your life. Drop by the bakery to pick one up.",
  },
  {
    question: "Do you take bookings or reservations?",
    answer:
      "We don&apos;t take bookings for regular dining — it&apos;s walk-in only. For function enquiries or private events, please email us at hello@foodiehan.com and we&apos;ll be happy to discuss options.",
  },
  {
    question: "Are you hiring?",
    answer: (
      <>
        We&apos;re always on the lookout for passionate people to join our team.
        Check out our current openings on{" "}
        <a
          href="https://www.seek.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-brand)] hover:underline"
        >
          SEEK
        </a>{" "}
        or send your CV to hello@foodiehan.com.
      </>
    ),
  },
  {
    question: "Do you offer delivery?",
    answer: (
      <>
        We don&apos;t currently offer in-house delivery, but you can find us on{" "}
        <strong className="font-medium">Uber Eats</strong> and{" "}
        <strong className="font-medium">DoorDash</strong> for delivery across
        Sydney metro areas. You can also order pickup directly through our{" "}
        <a
          href="/online-order"
          className="text-[var(--color-brand)] hover:underline"
        >
          online order page
        </a>
        .
      </>
    ),
  },
]

function FaqAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-[var(--color-surface-off)]">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-medium tracking-wide uppercase text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)]">
          {question}
        </span>
        <span
          className="flex-shrink-0 transition-transform duration-300"
          style={{
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            color: "var(--color-text-muted)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M4 10h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "500px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {answer}
        </div>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="mx-auto">
      <h2
        className="mb-2 text-3xl font-light text-center"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "var(--color-text-primary)",
        }}
      >
        Frequently Asked Questions
      </h2>
      <p className="mb-10 text-sm text-center text-[var(--color-text-muted)]">
        Maybe we can answer your question here!
      </p>

      <div>
        {faqs.map((faq, index) => (
          <FaqAccordionItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  )
}
