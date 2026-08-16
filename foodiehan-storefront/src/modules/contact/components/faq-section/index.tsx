"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type FaqItem = {
  question: string
  answer: string | React.ReactNode
}

const faqs: FaqItem[] = [
  {
    question:
      "Where do I find ingredients and nutrition information for FoodieHan products?",
    answer: (
      <>
        You can find detailed ingredient lists and nutritional information on
        each product&apos;s description page. Browse our{" "}
        <LocalizedClientLink
          href="/store"
          className="text-[#1a1a1a] underline hover:opacity-75"
        >
          product range
        </LocalizedClientLink>{" "}
        to learn more. If you still have questions, feel free to send us an
        enquiry using the form above.
      </>
    ),
  },
  {
    question: "How do I place a cake order?",
    answer: (
      <>
        You can place cake orders in-store at our bakery, or order online
        through our{" "}
        <LocalizedClientLink
          href="/online-order"
          className="text-[#1a1a1a] underline hover:opacity-75"
        >
          online order page
        </LocalizedClientLink>
        . We offer a range of celebration cakes, artisan creations, and specialty
        treats.
      </>
    ),
  },
  {
    question: "What is the processing time for a custom cake order?",
    answer:
      "We typically require 3 days notice for custom cake orders. For larger celebration cakes or elaborate designs, we recommend reaching out at least a week in advance so our pastry chefs can ensure every detail is crafted to perfection.",
  },
  {
    question: "Are FoodieHan breads baked fresh each day?",
    answer:
      "Yes, all FoodieHan breads and pastries are baked fresh every single morning. Our ovens start in the early hours to ensure you enjoy oven-warm freshness daily.",
  },
  {
    question: "Do you operate in an allergen free facility?",
    answer:
      "No — our bakery handles nuts, flour (gluten), dairy, eggs, and sesame on a daily basis. While we follow strict food handling and hygiene practices, we cannot guarantee an entirely allergen-free environment.",
  },
  {
    question: "Do you offer FoodieHan Store Gift Vouchers?",
    answer:
      "Yes! Gift vouchers are available for purchase and redemption in-store and online. They make the perfect gift for food and pastry lovers.",
  },
  {
    question: "Do you take bookings?",
    answer:
      "We operate on a walk-in basis for general café dining. For larger group bookings, catering enquiries, or special events, please reach out via our contact form.",
  },
  {
    question: "I would like to work at FoodieHan",
    answer: (
      <>
        We are always excited to meet passionate bakers, baristas, and front-of-house
        talent. Please email your CV and a brief introduction to{" "}
        <a
          href="mailto:careers@foodiehan.com.au"
          className="text-[#1a1a1a] underline hover:opacity-75"
        >
          careers@foodiehan.com.au
        </a>
        .
      </>
    ),
  },
  {
    question: "Do you deliver?",
    answer: (
      <>
        We offer local pickup and partner with major delivery platforms like{" "}
        <span className="font-medium text-[#1a1a1a]">Uber Eats</span> and{" "}
        <span className="font-medium text-[#1a1a1a]">DoorDash</span> for delivery
        in select areas. You can also place orders for pickup via our{" "}
        <LocalizedClientLink
          href="/online-order"
          className="text-[#1a1a1a] underline hover:opacity-75"
        >
          online order page
        </LocalizedClientLink>
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
    <div className="border-b border-[#e5e5e5]">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 small:py-5 text-left transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <span className="pr-6 text-sm small:text-base font-normal text-[#1a1a1a]">
          {question}
        </span>
        <span className="flex-shrink-0 text-xl font-light text-[#666666] select-none w-5 text-center leading-none">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "500px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-5 pt-1 text-sm leading-relaxed text-[#555555]">
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
    <div className="w-full">
      <h2
        className="mb-10 text-2xl small:text-3xl font-light text-center text-[#1a1a1a]"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        Maybe we can answer your question here!
      </h2>

      <div className="border-t border-[#e5e5e5]">
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

