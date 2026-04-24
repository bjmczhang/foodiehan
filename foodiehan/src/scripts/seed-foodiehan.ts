import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedFoodieHan({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  logger.info("FoodieHan seed: looking up existing infrastructure...")

  // ── 1. Get existing region ──────────────────────────────────────────────
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })
  if (!regions.length) {
    throw new Error(
      "No regions found. Please run the default seed script first: pnpm run seed"
    )
  }
  const region = regions[0]
  logger.info(`Using region: ${region.name} (${region.currency_code})`)

  // ── 2. Get existing shipping profile ───────────────────────────────────
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfiles.length) {
    throw new Error("No default shipping profile found. Please run the default seed first.")
  }
  const shippingProfile = shippingProfiles[0]

  // ── 3. Get existing sales channel ──────────────────────────────────────
  const [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!defaultSalesChannel) {
    throw new Error("Default Sales Channel not found. Please run the default seed first.")
  }

  // ── 4. Get existing stock location ─────────────────────────────────────
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  if (!stockLocations.length) {
    throw new Error("No stock location found. Please run the default seed first.")
  }
  const stockLocation = stockLocations[0]
  logger.info(`Using stock location: ${stockLocation.name}`)

  // ── 5. Ensure food categories exist ────────────────────────────────────
  logger.info("Checking food categories...")
  const { data: existingCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  const foodCategories = [
    { name: "Baked Goods", handle: "baked-goods" },
    { name: "Asian Delights", handle: "asian-delights" },
    { name: "Drinks", handle: "drinks" },
    { name: "Bundles", handle: "bundles" },
  ]

  const catMap: Record<string, string> = {}
  for (const fc of foodCategories) {
    const found = existingCats.find(
      (c: any) => c.handle === fc.handle || c.name === fc.name
    )
    if (found) {
      catMap[fc.name] = found.id
      logger.info(`Category already exists: ${fc.name}`)
    }
  }

  const toCreate = foodCategories.filter((fc) => !catMap[fc.name])
  if (toCreate.length) {
    const { result: newCats } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: toCreate.map((c) => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
        })),
      },
    })
    for (const cat of newCats) {
      catMap[cat.name] = cat.id
    }
    logger.info(`Created ${newCats.length} new categories.`)
  }

  // ── 6. Check which products already exist ──────────────────────────────
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(existingProducts.map((p: any) => p.handle))

  const currencyCode = region.currency_code as string

  // Helper – convert dollar-style cents to smallest unit
  const price = (aud: number) => ({ amount: aud * 100, currency_code: currencyCode })

  // ── 7. Define FoodieHan products ───────────────────────────────────────
  const productsToCreate = [
    // Baked Goods
    {
      title: "Sourdough Loaf",
      handle: "sourdough-loaf",
      description:
        "Hand-crafted 24-hour cold-fermented sourdough with a crispy crust and tender crumb. Perfect for sandwiches or toast.",
      category_ids: [catMap["Baked Goods"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80" }],
      options: [{ title: "Size", values: ["Standard (~800g)"] }],
      variants: [
        {
          title: "Standard (~800g)",
          sku: "FH-SOUR-001",
          options: { Size: "Standard (~800g)" },
          prices: [price(12)],
          manage_inventory: true,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Almond Croissant",
      handle: "almond-croissant",
      description:
        "Buttery, flaky croissant filled with frangipane and topped with toasted slivered almonds and a dusting of icing sugar.",
      category_ids: [catMap["Baked Goods"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80" }],
      options: [{ title: "Quantity", values: ["Single", "Box of 4"] }],
      variants: [
        {
          title: "Single",
          sku: "FH-CROI-001",
          options: { Quantity: "Single" },
          prices: [price(6)],
          manage_inventory: true,
        },
        {
          title: "Box of 4",
          sku: "FH-CROI-BOX4",
          options: { Quantity: "Box of 4" },
          prices: [price(22)],
          manage_inventory: true,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Matcha Chiffon Cake",
      handle: "matcha-chiffon-cake",
      description:
        "Light and airy Japanese-style chiffon cake infused with premium ceremonial-grade matcha. Subtle sweetness, vibrant colour.",
      category_ids: [catMap["Baked Goods"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80" }],
      options: [{ title: "Size", values: ["6-inch Round", "8-inch Round"] }],
      variants: [
        {
          title: "6-inch Round",
          sku: "FH-MTC-6",
          options: { Size: "6-inch Round" },
          prices: [price(38)],
          manage_inventory: true,
        },
        {
          title: "8-inch Round",
          sku: "FH-MTC-8",
          options: { Size: "8-inch Round" },
          prices: [price(52)],
          manage_inventory: true,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Pineapple Bun (菠蘿包)",
      handle: "pineapple-bun",
      description:
        "Classic Hong Kong-style polo bun with a crispy, crumbly sugar topping and soft, pillowy interior. Best enjoyed warm with a pat of butter.",
      category_ids: [catMap["Baked Goods"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80" }],
      options: [{ title: "Quantity", values: ["Single", "Pack of 6"] }],
      variants: [
        {
          title: "Single",
          sku: "FH-POLO-001",
          options: { Quantity: "Single" },
          prices: [price(4)],
          manage_inventory: true,
        },
        {
          title: "Pack of 6",
          sku: "FH-POLO-6PK",
          options: { Quantity: "Pack of 6" },
          prices: [price(22)],
          manage_inventory: true,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    // Asian Delights
    {
      title: "Char Siu Bao (叉燒包)",
      handle: "char-siu-bao",
      description:
        "Steamed BBQ pork buns made with our house-marinated char siu filling and fluffy steamed dough. A dim sum classic.",
      category_ids: [catMap["Asian Delights"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80" }],
      options: [{ title: "Quantity", values: ["Basket of 3", "Basket of 6"] }],
      variants: [
        {
          title: "Basket of 3",
          sku: "FH-CSBL-3",
          options: { Quantity: "Basket of 3" },
          prices: [price(12)],
          manage_inventory: true,
        },
        {
          title: "Basket of 6",
          sku: "FH-CSBL-6",
          options: { Quantity: "Basket of 6" },
          prices: [price(22)],
          manage_inventory: true,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Mango Mochi",
      handle: "mango-mochi",
      description:
        "Soft and chewy Japanese mochi filled with fresh mango cream and a whole mango cube. Naturally gluten-free.",
      category_ids: [catMap["Asian Delights"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80" }],
      options: [{ title: "Quantity", values: ["Single", "Box of 6"] }],
      variants: [
        {
          title: "Single",
          sku: "FH-MOCHI-M-1",
          options: { Quantity: "Single" },
          prices: [price(5)],
          manage_inventory: true,
        },
        {
          title: "Box of 6",
          sku: "FH-MOCHI-M-6",
          options: { Quantity: "Box of 6" },
          prices: [price(28)],
          manage_inventory: true,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    // Drinks
    {
      title: "Brown Sugar Bubble Tea",
      handle: "brown-sugar-bubble-tea",
      description:
        "House-made brown sugar syrup, fresh milk, and chewy tapioca pearls. Rich, creamy, and deeply satisfying.",
      category_ids: [catMap["Drinks"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1558857563-c0c63e679e8f?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1558857563-c0c63e679e8f?w=800&q=80" }],
      options: [
        { title: "Size", values: ["Regular (500ml)", "Large (700ml)"] },
        { title: "Sugar Level", values: ["Full", "Half", "Quarter", "No Sugar"] },
      ],
      variants: [
        {
          title: "Regular / Full",
          sku: "FH-BSBT-R-F",
          options: { Size: "Regular (500ml)", "Sugar Level": "Full" },
          prices: [price(7)],
          manage_inventory: false,
        },
        {
          title: "Large / Full",
          sku: "FH-BSBT-L-F",
          options: { Size: "Large (700ml)", "Sugar Level": "Full" },
          prices: [price(8)],
          manage_inventory: false,
        },
        {
          title: "Regular / Half",
          sku: "FH-BSBT-R-H",
          options: { Size: "Regular (500ml)", "Sugar Level": "Half" },
          prices: [price(7)],
          manage_inventory: false,
        },
        {
          title: "Large / Half",
          sku: "FH-BSBT-L-H",
          options: { Size: "Large (700ml)", "Sugar Level": "Half" },
          prices: [price(8)],
          manage_inventory: false,
        },
        {
          title: "Regular / No Sugar",
          sku: "FH-BSBT-R-NS",
          options: { Size: "Regular (500ml)", "Sugar Level": "No Sugar" },
          prices: [price(7)],
          manage_inventory: false,
        },
        {
          title: "Large / No Sugar",
          sku: "FH-BSBT-L-NS",
          options: { Size: "Large (700ml)", "Sugar Level": "No Sugar" },
          prices: [price(8)],
          manage_inventory: false,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Matcha Latte",
      handle: "matcha-latte",
      description:
        "Ceremonial-grade matcha whisked with steamed oat milk. Available hot or iced.",
      category_ids: [catMap["Drinks"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=800&q=80" }],
      options: [
        { title: "Temperature", values: ["Hot", "Iced"] },
      ],
      variants: [
        {
          title: "Hot",
          sku: "FH-MLC-HOT",
          options: { Temperature: "Hot" },
          prices: [price(6)],
          manage_inventory: false,
        },
        {
          title: "Iced",
          sku: "FH-MLC-ICE",
          options: { Temperature: "Iced" },
          prices: [price(6)],
          manage_inventory: false,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    // Bundles
    {
      title: "FoodieHan Afternoon Tea Set",
      handle: "afternoon-tea-set",
      description:
        "A curated selection for two: 1 sourdough loaf, 2 almond croissants, 4 pineapple buns, and 6 mango mochi. Perfect for sharing.",
      category_ids: [catMap["Bundles"]],
      status: ProductStatus.PUBLISHED,
      thumbnail:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" }],
      options: [{ title: "Serves", values: ["Set for 2"] }],
      variants: [
        {
          title: "Set for 2",
          sku: "FH-AT-SET2",
          options: { Serves: "Set for 2" },
          prices: [price(65)],
          manage_inventory: true,
        },
      ],
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
  ]

  // ── 8. Filter out already-existing products ─────────────────────────────
  const newProducts = productsToCreate.filter(
    (p) => !existingHandles.has(p.handle)
  )

  if (!newProducts.length) {
    logger.info("All FoodieHan products already exist. Nothing to create.")
    return
  }

  logger.info(`Creating ${newProducts.length} products...`)

  const { result: createdProducts } = await createProductsWorkflow(
    container
  ).run({ input: { products: newProducts as any } })

  logger.info(`Created ${createdProducts.length} products.`)

  // ── 9. Create inventory levels for managed-inventory variants ──────────
  logger.info("Creating inventory levels...")
  const inventoryItems: {
    inventory_item_id: string
    location_id: string
    stocked_quantity: number
  }[] = []

  for (const product of createdProducts) {
    for (const variant of product.variants ?? []) {
      const inventoryItems2 = (variant as any).inventory_items ?? []
      for (const ii of inventoryItems2) {
        inventoryItems.push({
          inventory_item_id: ii.inventory_item_id ?? ii.id,
          location_id: stockLocation.id,
          stocked_quantity: 50,
        })
      }
    }
  }

  if (inventoryItems.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryItems },
    })
    logger.info(`Created ${inventoryItems.length} inventory levels.`)
  }

  logger.info("FoodieHan seed complete!")
}
