import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "../styles/globals.css"
import "../styles/storefront.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
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
