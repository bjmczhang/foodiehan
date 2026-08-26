import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const BASE_URL = "https://www.mannabakery.au"
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

type SourceProduct = {
  id: number
  title: string
  handle: string
  body_html?: string | null
  images?: { src: string }[]
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

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: "application/json", "user-agent": "foodiehan-full-catalog-plan/1.0" },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export default async function planMannaFullCatalogImport({ container }: ExecArgs) {
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

  const categoryHandlesBySourceHandle = new Map<string, Set<string>>()
  COLLECTIONS.forEach((collectionHandle, index) => {
    for (const product of collectionPayloads[index].products) {
      const categories = categoryHandlesBySourceHandle.get(product.handle) ?? new Set<string>()
      categories.add(CATEGORY_DEFS[collectionHandle].handle)
      categoryHandlesBySourceHandle.set(product.handle, categories)
    }
  })

  const uncategorized = catalog.products.filter(
    (product) => !categoryHandlesBySourceHandle.has(product.handle)
  )
  for (const product of uncategorized) {
    const fallback = FALLBACK_CATEGORY_BY_HANDLE[product.handle]
    if (!fallback) throw new Error(`No fallback category for ${product.handle}`)
    categoryHandlesBySourceHandle.set(
      product.handle,
      new Set([CATEGORY_DEFS[fallback].handle])
    )
  }

  const normalizedHandles = catalog.products.map(medusaHandle)
  const duplicates = normalizedHandles.filter(
    (handle, index) => normalizedHandles.indexOf(handle) !== index
  )
  if (duplicates.length) {
    throw new Error(`Duplicate normalized handles: ${[...new Set(duplicates)].join(", ")}`)
  }

  const [{ data: categories }, { data: targetProducts }] = await Promise.all([
    query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle", "is_active"],
    }),
    query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "external_id",
        "metadata",
        "categories.id",
        "categories.handle",
      ],
    }),
  ])

  const targetByHandle = new Map(
    targetProducts.map((product: any) => [product.handle, product])
  )
  const existing = catalog.products.filter((product) =>
    targetByHandle.has(medusaHandle(product))
  )
  const create = catalog.products.filter(
    (product) => !targetByHandle.has(medusaHandle(product))
  )
  const collisions = existing.filter((product) => {
    const target = targetByHandle.get(medusaHandle(product)) as any
    return target.metadata?.source !== "Manna Bakery"
  })
  const requiredCategoryHandles = Object.values(CATEGORY_DEFS).map(({ handle }) => handle)
  const missingCategories = requiredCategoryHandles.filter(
    (handle) => !categories.some((category: any) => category.handle === handle)
  )

  const membershipCounts = Object.fromEntries(
    requiredCategoryHandles.map((handle) => [
      handle,
      catalog.products.filter((product) =>
        categoryHandlesBySourceHandle.get(product.handle)?.has(handle)
      ).length,
    ])
  )

  logger.info("Manna full catalog read-only plan complete")
  logger.info(`Source products: ${catalog.products.length}`)
  logger.info(`Existing source products: ${existing.length}`)
  logger.info(`Would create products: ${create.length}`)
  logger.info(`Non-Manna handle collisions: ${collisions.length}`)
  logger.info(`Existing categories: ${categories.map((c: any) => `${c.name}(${c.handle})`).join(", ")}`)
  logger.info(`Missing categories to create: ${missingCategories.join(", ") || "none"}`)
  logger.info(`Category memberships: ${JSON.stringify(membershipCounts)}`)
  logger.info(`Uncategorized source products assigned by fallback: ${uncategorized.length}`)
  logger.info(
    `Source products without images: ${catalog.products.filter((p) => !p.images?.length).length}`
  )
  logger.info(
    `Source products without descriptions: ${catalog.products.filter((p) => !p.body_html?.trim()).length}`
  )
  if (create.length) logger.info(`Products to create: ${create.map((p) => p.title).join(" | ")}`)
  if (collisions.length) {
    logger.warn(
      `Collision handles: ${collisions.map((p) => medusaHandle(p)).join(", ")}`
    )
  }
}
