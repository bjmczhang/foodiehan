import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const COLLECTION_URL =
  "https://www.mannabakery.au/collections/all-breads/products.json?limit=250"
const SOURCE_NAME = "Manna Bakery"

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
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    lt: "<",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    quot: '"',
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

function sortedNumbers(values: number[]) {
  return values.sort((left, right) => left - right)
}

export default async function verifyMannaBreadsImport({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const response = await fetch(COLLECTION_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "foodiehan-medusa-import-verify/1.0",
    },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`)
  const payload = (await response.json()) as { products?: SourceProduct[] }
  const sourceProducts = payload.products ?? []

  const { data: targetProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "handle",
      "title",
      "description",
      "external_id",
      "thumbnail",
      "metadata",
      "images.url",
      "variants.price_set.prices.amount",
      "variants.price_set.prices.currency_code",
    ],
  })
  const targetsByHandle = new Map(
    targetProducts.map((product: any) => [product.handle, product])
  )

  const missing: string[] = []
  const verified: string[] = []
  const existingUnchanged: string[] = []
  const mismatches: string[] = []

  for (const source of sourceProducts) {
    const handle = medusaHandle(source)
    const target = targetsByHandle.get(handle) as any
    if (!target) {
      missing.push(handle)
      continue
    }

    if (target.metadata?.source !== SOURCE_NAME) {
      existingUnchanged.push(handle)
      continue
    }

    const expectedImages = (source.images ?? [])
      .sort((left, right) => left.position - right.position)
      .map(({ src }) => src)
    const actualImages = (target.images ?? []).map(({ url }: any) => url)
    const expectedPrices = sortedNumbers(
      (source.variants ?? []).map(({ price }) => Number(price))
    )
    const actualPrices = sortedNumbers(
      (target.variants ?? []).flatMap((variant: any) =>
        (variant.price_set?.prices ?? [])
          .filter((price: any) => price.currency_code === "aud")
          .map((price: any) => Number(price.amount))
      )
    )
    const fields = [
      ["title", target.title, source.title.trim()],
      ["description", target.description ?? "", htmlToText(source.body_html)],
      ["external_id", String(target.external_id ?? ""), String(source.id)],
      ["thumbnail", target.thumbnail ?? "", expectedImages[0] ?? ""],
      ["images", JSON.stringify(actualImages), JSON.stringify(expectedImages)],
      ["prices", JSON.stringify(actualPrices), JSON.stringify(expectedPrices)],
    ]
    const badFields = fields
      .filter(([, actual, expected]) => actual !== expected)
      .map(([field]) => field)

    if (badFields.length) {
      mismatches.push(`${handle}: ${badFields.join(", ")}`)
    } else {
      verified.push(handle)
    }
  }

  logger.info(`Verified imported products: ${verified.length}`)
  logger.info(`Existing products intentionally unchanged: ${existingUnchanged.length}`)
  logger.info(`Missing products: ${missing.length}`)
  logger.info(`Imported products with field mismatches: ${mismatches.length}`)

  if (missing.length || mismatches.length) {
    throw new Error(
      `Verification failed. Missing=[${missing.join(", ")}], mismatches=[${mismatches.join(
        "; "
      )}]`
    )
  }
}
