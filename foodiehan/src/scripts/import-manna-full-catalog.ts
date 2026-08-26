import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  batchProductsWorkflow,
  createProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows"

const BASE_URL = "https://www.mannabakery.au"
const SOURCE_NAME = "Manna Bakery"
const IMPORT_VERSION = "full-catalog-2026-08-26"
const COLLECTIONS = ["all-breads", "all-cakes", "all-cookies", "best-seller"] as const

const CATEGORY_DEFS = {
  "all-breads": { name: "Artisan Breads", handle: "artisan-breads" },
  "all-cakes": { name: "Pastries & Cakes", handle: "pastries-&-cakes" },
  "all-cookies": { name: "Cookies", handle: "cookies" },
  "best-seller": { name: "Best Seller", handle: "best-seller" },
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

type ShopifyImage = { id: number; position: number; src: string }
type ShopifyOption = { name: string; position: number }
type ShopifyVariant = {
  id: number
  title: string
  price: string
  sku?: string | null
  option1?: string | null
  option2?: string | null
  option3?: string | null
}
type ShopifyProduct = {
  id: number
  title: string
  handle: string
  body_html?: string | null
  images?: ShopifyImage[]
  options?: ShopifyOption[]
  variants?: ShopifyVariant[]
}

function medusaHandle(product: ShopifyProduct) {
  const asciiHandle = product.handle
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return asciiHandle || `manna-${product.id}`
}

function stableSku(product: ShopifyProduct, variant: ShopifyVariant) {
  const supplied = variant.sku?.trim()
  if (supplied) return supplied
  return `MANNA-${medusaHandle(product).toUpperCase().slice(0, 32)}-${variant.id}`
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

function productOptions(product: ShopifyProduct) {
  const sourceOptions = (product.options ?? []).filter(
    ({ name }) => name.toLowerCase() !== "title"
  )
  if (!sourceOptions.length) return [{ title: "Default", values: ["Default"] }]

  return sourceOptions.map((option) => {
    const key = `option${option.position}` as "option1" | "option2" | "option3"
    const values = Array.from(
      new Set(
        (product.variants ?? [])
          .map((variant) => variant[key]?.trim())
          .filter((value): value is string => Boolean(value))
      )
    )
    return { title: option.name, values }
  })
}

function variantOptions(product: ShopifyProduct, variant: ShopifyVariant) {
  const sourceOptions = (product.options ?? []).filter(
    ({ name }) => name.toLowerCase() !== "title"
  )
  if (!sourceOptions.length) return { Default: "Default" }

  return Object.fromEntries(
    sourceOptions.map((option) => {
      const key = `option${option.position}` as "option1" | "option2" | "option3"
      return [option.name, variant[key]?.trim() || "Default"]
    })
  )
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: "application/json", "user-agent": "foodiehan-full-catalog-import/1.0" },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export default async function importMannaFullCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  const [catalog, ...collectionPayloads] = await Promise.all([
    fetchJson<{ products: ShopifyProduct[] }>("/products.json?limit=250"),
    ...COLLECTIONS.map((handle) =>
      fetchJson<{ products: ShopifyProduct[] }>(
        `/collections/${handle}/products.json?limit=250`
      )
    ),
  ])
  if (catalog.products.length !== 88) {
    throw new Error(`Catalog changed since approval: expected 88 products, found ${catalog.products.length}`)
  }

  const categoryHandlesBySourceHandle = new Map<string, Set<string>>()
  COLLECTIONS.forEach((collectionHandle, index) => {
    for (const product of collectionPayloads[index].products) {
      const values = categoryHandlesBySourceHandle.get(product.handle) ?? new Set<string>()
      values.add(CATEGORY_DEFS[collectionHandle].handle)
      categoryHandlesBySourceHandle.set(product.handle, values)
    }
  })
  for (const product of catalog.products) {
    if (categoryHandlesBySourceHandle.has(product.handle)) continue
    const fallback = FALLBACK_CATEGORY_BY_HANDLE[product.handle]
    if (!fallback) throw new Error(`No approved fallback category for ${product.handle}`)
    categoryHandlesBySourceHandle.set(
      product.handle,
      new Set([CATEGORY_DEFS[fallback].handle])
    )
  }

  const [{ data: regions }, shippingProfiles, salesChannels, categoryGraph, productGraph] =
    await Promise.all([
      query.graph({ entity: "region", fields: ["id", "name", "currency_code"] }),
      fulfillmentService.listShippingProfiles({ type: "default" }),
      salesChannelService.listSalesChannels({ name: "Default Sales Channel" }),
      query.graph({
        entity: "product_category",
        fields: ["id", "name", "handle", "is_active"],
      }),
      query.graph({
        entity: "product",
        fields: [
          "id",
          "handle",
          "metadata",
          "categories.id",
          "categories.handle",
        ],
      }),
    ])

  if (!regions.length) throw new Error("Target has no region")
  if (!shippingProfiles.length) throw new Error("Target has no default shipping profile")
  if (!salesChannels.length) throw new Error("Target has no Default Sales Channel")

  const currencyCode = String(regions[0].currency_code).toLowerCase()
  if (currencyCode !== "aud") throw new Error(`Expected AUD region, found ${currencyCode}`)

  const requiredCategories = Object.values(CATEGORY_DEFS)
  const existingCategoryByHandle = new Map(
    categoryGraph.data.map((category: any) => [category.handle, category])
  )
  const missingCategories = requiredCategories.filter(
    ({ handle }) => !existingCategoryByHandle.has(handle)
  )

  if (missingCategories.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map(({ name, handle }) => ({
          name,
          handle,
          is_active: true,
        })),
      },
    })
    for (const category of result) existingCategoryByHandle.set(category.handle, category)
    logger.info(`Created categories: ${result.map(({ name }) => name).join(", ")}`)
  }

  const targetByHandle = new Map(
    productGraph.data.map((product: any) => [product.handle, product])
  )
  const existingSourceProducts = catalog.products.filter((product) =>
    targetByHandle.has(medusaHandle(product))
  )
  const newSourceProducts = catalog.products.filter(
    (product) => !targetByHandle.has(medusaHandle(product))
  )

  if (existingSourceProducts.length !== 62 || newSourceProducts.length !== 26) {
    throw new Error(
      `Target changed since approval: expected 62 existing and 26 new; found ${existingSourceProducts.length} existing and ${newSourceProducts.length} new`
    )
  }
  const collisions = existingSourceProducts.filter((product) => {
    const target = targetByHandle.get(medusaHandle(product)) as any
    return target.metadata?.source !== SOURCE_NAME
  })
  if (collisions.length) {
    throw new Error(`Refusing non-Manna handle collisions: ${collisions.map(medusaHandle).join(", ")}`)
  }

  const categoryIdsFor = (product: ShopifyProduct) =>
    [...(categoryHandlesBySourceHandle.get(product.handle) ?? [])].map((handle) => {
      const category = existingCategoryByHandle.get(handle) as any
      if (!category) throw new Error(`Category was not resolved: ${handle}`)
      return category.id as string
    })

  const create = newSourceProducts.map((product) => {
    const images = (product.images ?? [])
      .sort((left, right) => left.position - right.position)
      .map(({ src }) => ({ url: src }))
    const variants = product.variants ?? []
    if (!variants.length) throw new Error(`Product has no variants: ${product.title}`)

    return {
      title: product.title.trim(),
      handle: medusaHandle(product),
      description: htmlToText(product.body_html) || null,
      external_id: String(product.id),
      status: ProductStatus.PUBLISHED,
      ...(images[0]?.url ? { thumbnail: images[0].url } : {}),
      images,
      category_ids: categoryIdsFor(product),
      metadata: {
        source: SOURCE_NAME,
        source_url: `${BASE_URL}/products/${product.handle}`,
        source_import_version: IMPORT_VERSION,
      },
      options: productOptions(product),
      variants: variants.map((variant) => {
        const amount = Math.round(Number(variant.price) * 100)
        if (!Number.isFinite(amount)) {
          throw new Error(`Invalid source price for ${product.title}: ${variant.price}`)
        }
        return {
          title: variant.title === "Default Title" ? "Default" : variant.title,
          sku: stableSku(product, variant),
          options: variantOptions(product, variant),
          prices: [{ amount, currency_code: currencyCode }],
          manage_inventory: false,
          metadata: { shopify_variant_id: String(variant.id) },
        }
      }),
      shipping_profile_id: shippingProfiles[0].id,
      sales_channels: [{ id: salesChannels[0].id }],
    }
  })

  const update = existingSourceProducts.map((product) => {
    const target = targetByHandle.get(medusaHandle(product)) as any
    const existingCategoryIds = (target.categories ?? []).map(({ id }: any) => id)
    return {
      id: target.id,
      category_ids: Array.from(
        new Set([...existingCategoryIds, ...categoryIdsFor(product)])
      ),
    }
  })

  const { result } = await batchProductsWorkflow(container).run({
    input: { create: create as any, update: update as any, delete: [] },
  })

  logger.info(`Created ${result.created.length} products.`)
  logger.info(`Updated category memberships on ${result.updated.length} products.`)
  logger.info("Deleted 0 products.")
}
