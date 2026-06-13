import { Metadata } from "next"
import ContactTemplate from "@modules/contact/templates"

export const metadata: Metadata = {
  title: "Contact Us | FoodieHan",
  description:
    "Get in touch with FoodieHan. Visit our bakery, send us a message, or find answers to frequently asked questions.",
}

export default async function ContactPage() {
  return <ContactTemplate />
}
