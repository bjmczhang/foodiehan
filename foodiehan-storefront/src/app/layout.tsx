import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "../styles/globals.css"
import "../styles/storefront.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "FoodieHan | Artisan Bakery & Korean Delights Sydney",
    template: "%s | FoodieHan",
  },
  description:
    "Sydney's premier online artisan bakery and Korean food store. Handcrafted breads, buns, pastries, and everyday comforts freshly prepared to order.",
  keywords: [
    "FoodieHan",
    "bakery Sydney",
    "Korean bakery",
    "artisan bread Sydney",
    "Asian bakery",
    "fresh baked buns",
    "Sydney food delivery",
  ],
  authors: [{ name: "FoodieHan", url: "https://foodiehan.com.au" }],
  creator: "FoodieHan",
  publisher: "FoodieHan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: getBaseURL(),
    siteName: "FoodieHan",
    title: "FoodieHan | Artisan Bakery & Korean Delights Sydney",
    description:
      "Handcrafted breads, Korean-inspired buns, and specialty bakery items baked fresh for your everyday moments in Sydney.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodieHan Artisan Bakery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodieHan | Artisan Bakery & Korean Delights Sydney",
    description:
      "Handcrafted breads, Korean-inspired buns, and specialty bakery items baked fresh for your everyday moments in Sydney.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="relative">{props.children}</div>
      </body>
    </html>
  )
}
