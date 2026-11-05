import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function setupAustraliaShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  logger.info("Setting up Australia shipping options...")

  // 1. Get Australia region
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })
  const auRegion = regions.find((r: any) => r.currency_code === "aud" || r.name.toLowerCase().includes("australia"))
  if (!auRegion) {
    throw new Error("Australia region not found in DB!")
  }
  logger.info(`Found Australia region: ${auRegion.id} (${auRegion.name}, ${auRegion.currency_code})`)

  // 2. Get stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  const stockLocation = stockLocations[0]
  if (!stockLocation) {
    throw new Error("Stock location not found!")
  }
  logger.info(`Using stock location: ${stockLocation.name} (${stockLocation.id})`)

  // 3. Get default shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfiles.length) {
    throw new Error("No default shipping profile found!")
  }
  const shippingProfile = shippingProfiles[0]
  logger.info(`Using shipping profile: ${shippingProfile.name} (${shippingProfile.id})`)

  // 4. Ensure fulfillment provider is linked to stock location
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    })
    logger.info("Linked manual_manual to stock location")
  } catch (e: any) {
    logger.info(`Link stock location -> fulfillment provider: ${e.message}`)
  }

  // 5. Check or create Australia fulfillment set
  let fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets(
    { name: "Australian Delivery" },
    { relations: ["service_zones", "service_zones.geo_zones"] }
  )

  let fulfillmentSet: any = fulfillmentSets[0]

  if (!fulfillmentSet) {
    logger.info("Creating 'Australian Delivery' fulfillment set...")
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Australian Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Australia Wide",
          geo_zones: [
            {
              country_code: "au",
              type: "country",
            },
          ],
        },
      ],
    })
  }

  // Reload fulfillment set with service zones
  fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets(
    { id: fulfillmentSet.id },
    { relations: ["service_zones", "service_zones.geo_zones"] }
  )
  fulfillmentSet = fulfillmentSets[0]

  let serviceZone = fulfillmentSet.service_zones?.find((sz: any) => sz.name === "Australia Wide")
  if (!serviceZone) {
    logger.info("Creating Australia Wide service zone...")
    serviceZone = await fulfillmentModuleService.createServiceZones({
      name: "Australia Wide",
      fulfillment_set_id: fulfillmentSet.id,
      geo_zones: [
        {
          country_code: "au",
          type: "country",
        },
      ],
    })
  }

  logger.info(`Using service zone: ${serviceZone.name} (${serviceZone.id})`)

  // Link stock location to fulfillment set
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    })
    logger.info("Linked stock location to Australian Delivery fulfillment set")
  } catch (e: any) {
    logger.info(`Link stock location -> fulfillment set: ${e.message}`)
  }

  // 6. Check existing shipping options
  const existingOptions = await fulfillmentModuleService.listShippingOptions({
    service_zone_id: serviceZone.id,
  })

  logger.info(`Existing shipping options for service zone: ${existingOptions.length}`)

  if (!existingOptions.length) {
    logger.info("Creating standard & express shipping options for Australia...")
    const { result: createdOptions } = await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Delivery (Sydney Metro)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZone.id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Fresh delivery in 1-2 business days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "aud",
              amount: 10,
            },
            {
              region_id: auRegion.id,
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Express Delivery (Next Day)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZone.id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Priority next-day delivery.",
            code: "express",
          },
          prices: [
            {
              currency_code: "aud",
              amount: 18,
            },
            {
              region_id: auRegion.id,
              amount: 18,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })
    logger.info(`Successfully created ${createdOptions.length} shipping options!`)
  } else {
    logger.info("Shipping options already exist.")
  }

  logger.info("Setup completed successfully!")
}

