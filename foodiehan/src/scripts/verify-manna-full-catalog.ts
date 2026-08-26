import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const BASE_URL = "https://www.mannabakery.au"
const SOURCE_NAME = "Manna Bakery"
const IMPORT_VERSION = "full-catalog-2026-08-26"
const COLLECTIONS = ["all-breads", "all-cakes", "all-cookies", "best-seller"] as const
const CATEGORY_DEFS = {
  "all-breads": { handle: "artisan-breads" },
  "all-cakes": { handle: "pastries-&-cakes" },
  "all-cookies": { handle: "cookies" },
  "best-seller": { handle: "best-seller" },
} as const
const FALLBACK_CATEGORY_BY_HANDLE: Record<string, keyof typeof CATEGORY_DEFS> = {
  "custard-cream-bun-카스테라-크림빵": "all-breads",
  "fresh-cream-mocha-bun-생크림-모카번": "all-breads",
  "plain-croissant-크로아상": "all-breads",
  "white-bean-doughnut-생도넛츠": "all-breads",
  "twister-doughnut-꽈배기": "all-breads",
  "matcha-almond-cookie-녹차-아몬드-쿠키": "all-cookies",
  "almond-nougat-cookies-chocolate": "all-cookies",
  "matcha-tiramisu-container-녹차-티라미수-컨테이너": "all-cakes",
  "tiramisu-container-티라미수-컨테이너": "all-cakes",
  "roll-cake-slice-coffee": "all-cakes",
  "roll-cake-slice-matcha": "all-cakes",
  "roll-cake-slice-plain": "all-cakes",
  "matcha-roll-cake-녹차-롤케이크": "all-cakes",
  "coffee-roll-cake-커피-롤케이크": "all-cakes",
  "plain-roll-cake-플레인-롤케이크": "all-cakes",
}

type SourceProduct = {
  id: number
  title: string
  handle: string
  body_html?: string | null
  images?: { position: number; src: string }[]
  variants?: { price: string }[]
}

function medusaHandle(product: SourceProduct) {
  const asciiHandle = product.handle
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return asciiHandle || `manna-${product.id}`
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&", apos: "'", gt: ">", hellip: "…", lt: "<", nbsp: " ", ndash: "–", mdash: "—", quot: '"',
  }
  return value.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (entity, code) => {
    if (code[0] !== "#") return namedEntities[code.toLowerCase()] ?? entity
    const isHex = code[1].toLowerCase() === "x"
    const point = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10)
    return Number.isFinite(point) ? String.fromCodePoint(point) : entity
  })
}

function htmlToText(html?: string | null) {
  return decodeHtmlEntities(
    String(html ?? "")
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])\s*>/gi, "\n")
      .replace(/<li(?:\s[^>]*)?>/gi, "• ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\r/g, "")
    .replace(/[\t ]+\n/g, "\n")
    .replace(/\n[\t ]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: "application/json", "user-agent": "foodiehan-full-catalog-verify/1.0" },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export default async function verifyMannaFullCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const [catalog, ...collectionPayloads] = await Promise.all([
    fetchJson<{ products: SourceProduct[] }>("/products.json?limit=250"),
    ...COLLECTIONS.map((handle) =>
      fetchJson<{ products: SourceProduct[] }>(
        `/collections/${handle}/products.json?limit=250`
      )
    ),
  ])

  const expectedCategories = new Map<string, Set<string>>()
  COLLECTIONS.forEach((collectionHandle, index) => {
    for (const product of collectionPayloads[index].products) {
      const values = expectedCategories.get(product.handle) ?? new Set<string>()
      values.add(CATEGORY_DEFS[collectionHandle].handle)
      expectedCategories.set(product.handle, values)
    }
  })
  for (const product of catalog.products) {
    if (expectedCategories.has(product.handle)) continue
    const fallback = FALLBACK_CATEGORY_BY_HANDLE[product.handle]
    if (!fallback) throw new Error(`No fallback category for ${product.handle}`)
    expectedCategories.set(product.handle, new Set([CATEGORY_DEFS[fallback].handle]))
  }

  const [{ data: categories }, { data: products }] = await Promise.all([
    query.graph({ entity: "product_category", fields: ["id", "handle", "name"] }),
    query.graph({
      entity: "product",
      fields: [
        "id", "handle", "title", "description", "external_id", "thumbnail", "metadata",
        "categories.handle", "images.url",
        "variants.price_set.prices.amount", "variants.price_set.prices.currency_code",
      ],
    }),
  ])
  const targetByHandle = new Map(products.map((product: any) => [product.handle, product]))
  const categoryHandleSet = new Set(categories.map((category: any) => category.handle))

  const missingProducts: string[] = []
  const missingMemberships: string[] = []
  const newProductMismatches: string[] = []
  let verifiedNewProducts = 0

  for (const source of catalog.products) {
    const handle = medusaHandle(source)
    const target = targetByHandle.get(handle) as any
    if (!target) {
      missingProducts.push(handle)
      continue
    }

    const actualCategoryHandles = new Set(
      (target.categories ?? []).map((category: any) => category.handle)
    )
    for (const expected of expectedCategories.get(source.handle) ?? []) {
      if (!actualCategoryHandles.has(expected)) {
        missingMemberships.push(`${handle}->${expected}`)
      }
    }

    if (target.metadata?.source_import_version !== IMPORT_VERSION) continue
    verifiedNewProducts++

    const expectedImages = (source.images ?? [])
      .sort((left, right) => left.position - right.position)
      .map(({ src }) => src)
    const actualImages = (target.images ?? []).map(({ url }: any) => url)
    const expectedPrices = (source.variants ?? [])
      .map(({ price }) => Math.round(Number(price) * 100))
      .sort((left, right) => left - right)
    const actualPrices = (target.variants ?? [])
      .flatMap((variant: any) =>
        (variant.price_set?.prices ?? [])
          .filter((price: any) => price.currency_code === "aud")
          .map((price: any) => Number(price.amount))
      )
      .sort((left: number, right: number) => left - right)
    const checks = [
      ["title", target.title, source.title.trim()],
      ["description", target.description ?? "", htmlToText(source.body_html)],
      ["external_id", String(target.external_id ?? ""), String(source.id)],
      ["thumbnail", target.thumbnail ?? "", expectedImages[0] ?? ""],
      ["images", JSON.stringify(actualImages), JSON.stringify(expectedImages)],
      ["prices", JSON.stringify(actualPrices), JSON.stringify(expectedPrices)],
      ["source", target.metadata?.source, SOURCE_NAME],
    ]
    const badFields = checks
      .filter(([, actual, expected]) => actual !== expected)
      .map(([field]) => field)
    if (badFields.length) newProductMismatches.push(`${handle}: ${badFields.join(",")}`)
  }

  const requiredCategoryHandles = Object.values(CATEGORY_DEFS).map(({ handle }) => handle)
  const missingCategories = requiredCategoryHandles.filter(
    (handle) => !categoryHandleSet.has(handle)
  )

  logger.info(`Source products checked: ${catalog.products.length}`)
  logger.info(`New products fully verified: ${verifiedNewProducts}`)
  logger.info(`Missing products: ${missingProducts.length}`)
  logger.info(`Missing categories: ${missingCategories.length}`)
  logger.info(`Missing category memberships: ${missingMemberships.length}`)
  logger.info(`New products with field mismatches: ${newProductMismatches.length}`)

  if (
    verifiedNewProducts !== 26 ||
    missingProducts.length ||
    missingCategories.length ||
    missingMemberships.length ||
    newProductMismatches.length
  ) {
    throw new Error(
      `Verification failed: verifiedNew=${verifiedNewProducts}; missingProducts=[${missingProducts.join(",")}]; missingCategories=[${missingCategories.join(",")}]; missingMemberships=[${missingMemberships.join(",")}]; mismatches=[${newProductMismatches.join(";")}]`
    )
  }
}
