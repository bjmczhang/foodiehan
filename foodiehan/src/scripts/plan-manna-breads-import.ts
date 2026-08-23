import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const COLLECTION_URL =
  "https://www.mannabakery.au/collections/all-breads/products.json?limit=250"

type SourceProduct = {
  id: number
  handle: string
  title: string
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

export default async function planMannaBreadsImport({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  const response = await fetch(COLLECTION_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "foodiehan-medusa-import-plan/1.0",
    },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`)

  const payload = (await response.json()) as { products?: SourceProduct[] }
  const sourceProducts = payload.products ?? []
  if (!sourceProducts.length) throw new Error("Source returned no products")

  const duplicateHandles = sourceProducts.filter(
    (product, index) =>
      sourceProducts.findIndex(
        (candidate) => medusaHandle(candidate) === medusaHandle(product)
      ) !==
      index
  )
  if (duplicateHandles.length) {
    throw new Error(
      `Duplicate normalized handles: ${duplicateHandles.map(medusaHandle).join(", ")}`
    )
  }

  const invalidPrices = sourceProducts.filter((product) =>
    (product.variants ?? []).some(({ price }) => !Number.isFinite(Number(price)))
  )
  if (invalidPrices.length) {
    throw new Error(
      `Invalid source prices: ${invalidPrices.map(({ title }) => title).join(", ")}`
    )
  }

  const [{ data: regions }, shippingProfiles, salesChannels, productGraph] =
    await Promise.all([
      query.graph({
        entity: "region",
        fields: ["id", "name", "currency_code"],
      }),
      fulfillmentService.listShippingProfiles({ type: "default" }),
      salesChannelService.listSalesChannels({ name: "Default Sales Channel" }),
      query.graph({
        entity: "product",
        fields: [
          "id",
          "handle",
          "external_id",
          "images.id",
          "images.url",
          "variants.id",
          "variants.title",
          "variants.sku",
          "variants.price_set.prices.amount",
          "variants.price_set.prices.currency_code",
        ],
      }),
    ])

  if (!regions.length) throw new Error("Target has no region")
  if (!shippingProfiles.length) throw new Error("Target has no default shipping profile")
  if (!salesChannels.length) throw new Error("Target has no Default Sales Channel")

  const existingHandles = new Set(
    productGraph.data.map((product: any) => product.handle)
  )
  const existing = sourceProducts.filter((product) =>
    existingHandles.has(medusaHandle(product))
  )
  const create = sourceProducts.filter(
    (product) => !existingHandles.has(medusaHandle(product))
  )
  const withoutDescription = sourceProducts.filter(({ body_html }) => !body_html?.trim())
  const withoutImages = sourceProducts.filter(({ images }) => !images?.length)
  const imageCount = sourceProducts.reduce(
    (total, product) => total + (product.images?.length ?? 0),
    0
  )
  const imageHosts = Array.from(
    new Set(
      sourceProducts.flatMap((product) =>
        (product.images ?? []).map(({ src }) => new URL(src).hostname)
      )
    )
  )

  logger.info("Manna import read-only plan complete")
  logger.info(`Source products: ${sourceProducts.length}`)
  logger.info(`Would create: ${create.length}`)
  logger.info(`Would skip by handle: ${existing.length}`)
  logger.info(`Source images: ${imageCount}`)
  logger.info(`Products without images: ${withoutImages.length}`)
  logger.info(`Products without descriptions: ${withoutDescription.length}`)
  logger.info(`Image hosts: ${imageHosts.join(", ")}`)
  logger.info(`Target currency: ${regions[0].currency_code}`)

  if (existing.length) {
    logger.info(`Skipped handles: ${existing.map(medusaHandle).join(", ")}`)
    for (const sourceProduct of existing) {
      const target = productGraph.data.find(
        (product: any) => product.handle === medusaHandle(sourceProduct)
      ) as any
      logger.info(
        `Existing ${medusaHandle(sourceProduct)}: ${target.images?.length ?? 0} image(s), ${
          target.variants?.length ?? 0
        } variant(s), prices=${JSON.stringify(
          (target.variants ?? []).flatMap((variant: any) =>
            (variant.price_set?.prices ?? []).map((price: any) => ({
              amount: price.amount,
              currency_code: price.currency_code,
            }))
          )
        )}`
      )
    }
  }
}
