import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

const PRODUCT_IMAGE_MAP: Record<
  string,
  { thumbnail: string; images: { url: string }[] }
> = {
  "korean-kimchi": {
    thumbnail: "/images/products/kimchi/korean-kimchi.webp",
    images: [{ url: "/images/products/kimchi/korean-kimchi.webp" }],
  },
  "pizza-slice": {
    thumbnail: "/images/products/breads/pizza-slice.webp",
    images: [{ url: "/images/products/breads/pizza-slice.webp" }],
  },
  "french-almond-cake": {
    thumbnail: "/images/products/breads/french-almond-cake.webp",
    images: [{ url: "/images/products/breads/french-almond-cake.webp" }],
  },
  "sweet-potato-ball": {
    thumbnail: "/images/products/breads/sweet-potato-ball.webp",
    images: [{ url: "/images/products/breads/sweet-potato-ball.webp" }],
  },
  "red-bean-bun": {
    thumbnail: "/images/products/buns/red-bean-bun.webp",
    images: [{ url: "/images/products/buns/red-bean-bun.webp" }],
  },
  bomboloni: {
    thumbnail: "/images/products/breads/bomboloni.webp",
    images: [{ url: "/images/products/breads/bomboloni.webp" }],
  },
  "salted-butter-bun": {
    thumbnail: "/images/products/breads/salted-butter-bun.webp",
    images: [
      { url: "/images/products/breads/salted-butter-bun.webp" },
      { url: "/images/products/breads/salted-butter-bun2.webp" },
    ],
  },
  "peanut-crust-bun": {
    thumbnail: "/images/products/buns/peanut-crust-bun.webp",
    images: [{ url: "/images/products/buns/peanut-crust-bun.webp" }],
  },
  "sticky-rice-sticks": {
    thumbnail: "/images/products/buns/sticky-rice-sticks.webp",
    images: [{ url: "/images/products/buns/sticky-rice-sticks.webp" }],
  },
}

export default async function fixProductImages({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Starting product image fix...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "thumbnail", "images.*"],
  })

  logger.info(`Found ${products.length} products to check.`)

  for (const product of products) {
    const handle = product.handle as string
    const fixData = PRODUCT_IMAGE_MAP[handle]

    if (fixData) {
      logger.info(`Updating product [${product.title}] (${handle})...`)
      logger.info(`  Old Thumbnail: ${product.thumbnail}`)
      logger.info(`  New Thumbnail: ${fixData.thumbnail}`)

      await updateProductsWorkflow(container).run({
        input: {
          selector: { id: product.id },
          update: {
            thumbnail: fixData.thumbnail,
            images: fixData.images,
          },
        },
      })

      logger.info(`  Successfully updated [${product.title}].`)
    } else {
      logger.warn(`No mapping found for product handle: ${handle}`)
    }
  }

  logger.info("Product image fix completed successfully!")
}
