import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://foodiehan.com.au"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account/", "/order/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

