const excludedPaths = ["/checkout", "/account/*", "/order/*"]

module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "https://foodiehan.com.au"),
  generateRobotsTxt: true,
  exclude: [...excludedPaths, "/[sitemap]"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
}
