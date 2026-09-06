const assert = require("node:assert/strict")
const { loadEnvConfig } = require(require.resolve("@next/env", {
  paths: [require.resolve("next/package.json")],
}))
loadEnvConfig(process.cwd())
const base = process.env.STOREFRONT_TEST_URL || "http://localhost:8000"
const headers = {
  "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
}
async function run() {
  const get = async (path) =>
    (await fetch(process.env.MEDUSA_BACKEND_URL + path, { headers })).json()
  const [regions, products, categories, collections] = await Promise.all([
    get("/store/regions"),
    get("/store/products?limit=1"),
    get("/store/product-categories?limit=100"),
    get("/store/collections?limit=1"),
  ])
  const country = regions.regions[0].countries[0].iso_2
  const routes = [
    "",
    "/about",
    "/store",
    "/store?sortBy=price_asc",
    "/store?page=2",
    "/search?q=butter",
    "/search?q=zzzznonexistent",
    "/contact",
    "/account",
    "/account/orders",
    "/account/profile",
    "/account/addresses",
    "/account/orders/details/test-unauthed",
    "/cart",
    "/checkout",
    "/online-order",
    "/order/test-only/transfer/test-only",
  ]
  routes.push("/products/" + products.products[0].handle)
  routes.push(
    ...categories.product_categories.map((c) => "/categories/" + c.handle)
  )
  if (collections.collections?.length)
    routes.push("/collections/" + collections.collections[0].handle)
  for (let i = 0; i < routes.length; i += 4)
    await Promise.all(
      routes.slice(i, i + 4).map(async (route) => {
        const r = await fetch(base + "/" + country + route)
        const html = await r.text()
        assert.equal(r.status, 200, route + " HTTP status")
        assert.match(html, /<h1[^>]*>/, route + " has a visible heading")
        assert.ok(
          !html.includes("Let’s try that again."),
          route + " did not fail"
        )
        if (route.includes("zzzznonexistent"))
          assert.ok(html.includes("No products found."), "Search empty state")
        if (route.startsWith("/account"))
          assert.ok(html.includes("Welcome back."), "Signed-out account guard")
        console.log("PASS", route || "/")
      })
    )
  const missing = await fetch(base + "/" + country + "/not-a-real-page")
  assert.equal(missing.status, 404)
  console.log("PASS branded 404")
  const html = await fetch(base + "/" + country).then((r) => r.text())
  const source = html
    .match(/src="([^"]*\/_next\/image[^"]*)"/)?.[1]
    ?.replaceAll("&amp;", "&")
  if (source) {
    const r = await fetch(base + source)
    assert.equal(r.status, 200)
    assert.match(r.headers.get("content-type"), /image/)
    console.log("PASS optimized hero image")
  }
  const api = async (body, origin = base) =>
    fetch(base + "/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", origin },
      body: JSON.stringify(body),
    })
  assert.equal((await api({})).status, 400)
  assert.equal((await api({}, "https://unrelated.example")).status, 403)
  assert.equal((await api({ website: "honeypot-check" })).status, 400)
  console.log("PASS contact validation, origin and honeypot handling")
  console.log("All production route and API checks passed.")
}
run().catch((e) => {
  console.error("FAIL", e.message)
  process.exitCode = 1
})
