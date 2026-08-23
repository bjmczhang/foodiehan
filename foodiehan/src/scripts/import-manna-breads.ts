import type { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { adjustedProductPrice } from "./utils/product-price-adjustment";

const COLLECTION_URL =
  "https://www.mannabakery.au/collections/all-breads/products.json?limit=250";
const SOURCE_NAME = "Manna Bakery";

type ShopifyImage = {
  id: number;
  position: number;
  src: string;
};

type ShopifyOption = {
  name: string;
  position: number;
};

type ShopifyVariant = {
  id: number;
  title: string;
  price: string;
  sku?: string | null;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
};

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html?: string | null;
  images?: ShopifyImage[];
  options?: ShopifyOption[];
  variants?: ShopifyVariant[];
};

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
  };

  return value.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (entity, code) => {
    if (code[0] !== "#") return namedEntities[code.toLowerCase()] ?? entity;

    const isHex = code[1].toLowerCase() === "x";
    const point = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
    return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
  });
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
    .trim();
}

function stableSku(product: ShopifyProduct, variant: ShopifyVariant) {
  const supplied = variant.sku?.trim();
  if (supplied) return supplied;

  const handle = product.handle
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase()
    .slice(0, 32);

  return `MANNA-${handle}-${variant.id}`;
}

function medusaHandle(product: ShopifyProduct) {
  const asciiHandle = product.handle
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return asciiHandle || `manna-${product.id}`;
}

function productOptions(product: ShopifyProduct) {
  const sourceOptions = (product.options ?? []).filter(
    ({ name }) => name.toLowerCase() !== "title"
  );

  if (!sourceOptions.length) {
    return [{ title: "Default", values: ["Default"] }];
  }

  return sourceOptions.map((option) => {
    const key = `option${option.position}` as "option1" | "option2" | "option3";
    const values = Array.from(
      new Set(
        (product.variants ?? [])
          .map((variant) => variant[key]?.trim())
          .filter((value): value is string => Boolean(value))
      )
    );

    return { title: option.name, values };
  });
}

function variantOptions(product: ShopifyProduct, variant: ShopifyVariant) {
  const sourceOptions = (product.options ?? []).filter(
    ({ name }) => name.toLowerCase() !== "title"
  );

  if (!sourceOptions.length) return { Default: "Default" };

  return Object.fromEntries(
    sourceOptions.map((option) => {
      const key = `option${option.position}` as
        | "option1"
        | "option2"
        | "option3";
      return [option.name, variant[key]?.trim() || "Default"];
    })
  );
}

async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const response = await fetch(COLLECTION_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "foodiehan-medusa-import/1.0",
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`${SOURCE_NAME} returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { products?: ShopifyProduct[] };
  if (!Array.isArray(payload.products) || !payload.products.length) {
    throw new Error("The source collection returned no products");
  }

  return payload.products;
}

export default async function importMannaBreads({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentService = container.resolve(Modules.FULFILLMENT);
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL);
  logger.info("Manna import mode: COMMIT");

  const sourceProducts = await fetchShopifyProducts();
  const duplicateHandles = sourceProducts.filter(
    (product, index) =>
      sourceProducts.findIndex(
        (candidate) => medusaHandle(candidate) === medusaHandle(product)
      ) !== index
  );
  if (duplicateHandles.length) {
    throw new Error(
      `Duplicate normalized handles: ${duplicateHandles
        .map(medusaHandle)
        .join(", ")}`
    );
  }

  const imageHosts = Array.from(
    new Set(
      sourceProducts.flatMap((product) =>
        (product.images ?? []).map(({ src }) => new URL(src).hostname)
      )
    )
  );
  const productsWithoutImages = sourceProducts.filter(
    (product) => !(product.images ?? []).length
  );

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  });
  if (!regions.length)
    throw new Error("No region exists in the target database");
  const region = regions[0];

  const shippingProfiles = await fulfillmentService.listShippingProfiles({
    type: "default",
  });
  if (!shippingProfiles.length) {
    throw new Error(
      "No default shipping profile exists in the target database"
    );
  }

  const [salesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });
  if (!salesChannel) {
    throw new Error(
      "Default Sales Channel does not exist in the target database"
    );
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "handle",
      "external_id",
      "metadata",
      "images.id",
      "images.url",
      "variants.id",
      "variants.title",
      "variants.sku",
    ],
  });
  const existingByHandle = new Map(
    existingProducts.map((product: any) => [product.handle, product])
  );
  const productsToCreate = sourceProducts.filter(
    (product) => !existingByHandle.has(medusaHandle(product))
  );
  const productsToSkip = sourceProducts.filter((product) =>
    existingByHandle.has(medusaHandle(product))
  );

  logger.info(`Source products: ${sourceProducts.length}`);
  logger.info(`Products to create: ${productsToCreate.length}`);
  logger.info(`Existing products left unchanged: ${productsToSkip.length}`);
  logger.info(
    `Products without source images: ${productsWithoutImages.length}`
  );
  logger.info(`Image hosts: ${imageHosts.join(", ")}`);
  logger.info(`Target currency: ${region.currency_code}`);

  if (!productsToCreate.length) {
    logger.info("Nothing to import.");
    return;
  }

  const currencyCode = String(region.currency_code).toLowerCase();
  const mapCreateProduct = (product: ShopifyProduct) => {
    const images = (product.images ?? [])
      .sort((left, right) => left.position - right.position)
      .map(({ src }) => ({ url: src }));
    const variants = product.variants ?? [];

    if (!variants.length) {
      throw new Error(`Product has no variants: ${product.title}`);
    }

    return {
      title: product.title.trim(),
      handle: medusaHandle(product),
      description: htmlToText(product.body_html) || null,
      external_id: String(product.id),
      status: ProductStatus.PUBLISHED,
      ...(images[0]?.url ? { thumbnail: images[0].url } : {}),
      images,
      metadata: {
        source: SOURCE_NAME,
        source_url: `https://www.mannabakery.au/products/${product.handle}`,
      },
      options: productOptions(product),
      variants: variants.map((variant) => {
        const sourceAmount = Number(variant.price);
        if (!Number.isFinite(sourceAmount)) {
          throw new Error(
            `Invalid price for ${product.title}: ${variant.price}`
          );
        }

        const amount = adjustedProductPrice(sourceAmount);

        return {
          title: variant.title === "Default Title" ? "Default" : variant.title,
          sku: stableSku(product, variant),
          options: variantOptions(product, variant),
          prices: [{ amount, currency_code: currencyCode }],
          manage_inventory: false,
          metadata: { shopify_variant_id: String(variant.id) },
        };
      }),
      shipping_profile_id: shippingProfiles[0].id,
      sales_channels: [{ id: salesChannel.id }],
    };
  };

  const products = productsToCreate.map(mapCreateProduct);
  const { result } = await createProductsWorkflow(container).run({
    input: { products: products as any },
  });

  logger.info(`Created ${result.length} products in the target database.`);
  logger.info(`Left ${productsToSkip.length} existing products unchanged.`);
}
