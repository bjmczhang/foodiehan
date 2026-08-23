import type { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import { adjustedProductPrice } from "./utils/product-price-adjustment";

const COLLECTION_URL =
  "https://www.mannabakery.au/collections/all-breads/products.json?limit=250";
const SOURCE_NAME = "Manna Bakery";
const APPROVED_HANDLES = new Set([
  "salted-butter-bun",
  "red-bean-bun",
  "peanut-crust-bun",
  "sticky-rice-sticks",
  "pizza-slice",
]);

type ShopifyImage = { position: number; src: string };
type ShopifyVariant = {
  id: number;
  title: string;
  price: string;
  sku?: string | null;
};
type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html?: string | null;
  images?: ShopifyImage[];
  variants?: ShopifyVariant[];
};

function medusaHandle(product: ShopifyProduct) {
  const asciiHandle = product.handle
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return asciiHandle || `manna-${product.id}`;
}

function stableSku(product: ShopifyProduct, variant: ShopifyVariant) {
  const supplied = variant.sku?.trim();
  if (supplied) return supplied;

  const handle = medusaHandle(product).toUpperCase().slice(0, 32);
  return `MANNA-${handle}-${variant.id}`;
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

export default async function updateApprovedMannaBreads({
  container,
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const response = await fetch(COLLECTION_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "foodiehan-approved-product-update/1.0",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);

  const payload = (await response.json()) as { products?: ShopifyProduct[] };
  const sourceProducts = (payload.products ?? []).filter((product) =>
    APPROVED_HANDLES.has(medusaHandle(product))
  );
  const sourceHandles = new Set(sourceProducts.map(medusaHandle));

  if (
    sourceProducts.length !== APPROVED_HANDLES.size ||
    [...APPROVED_HANDLES].some((handle) => !sourceHandles.has(handle))
  ) {
    throw new Error(
      `Source allowlist mismatch. Expected=${[...APPROVED_HANDLES].join(
        ","
      )}; found=${[...sourceHandles].join(",")}`
    );
  }

  const { data: targetProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "handle",
      "metadata",
      "images.id",
      "images.url",
      "variants.id",
      "variants.title",
      "variants.sku",
      "variants.metadata",
    ],
  });
  const targetByHandle = new Map(
    targetProducts
      .filter((product: any) => APPROVED_HANDLES.has(product.handle))
      .map((product: any) => [product.handle, product])
  );

  if (
    targetByHandle.size !== APPROVED_HANDLES.size ||
    [...APPROVED_HANDLES].some((handle) => !targetByHandle.has(handle))
  ) {
    throw new Error(
      `Target allowlist mismatch. Expected exactly five existing products; found=${[
        ...targetByHandle.keys(),
      ].join(",")}`
    );
  }

  const updates = sourceProducts.map((source) => {
    const handle = medusaHandle(source);
    const target = targetByHandle.get(handle) as any;
    const sourceImages = (source.images ?? []).sort(
      (left, right) => left.position - right.position
    );
    const sourceVariants = source.variants ?? [];
    const targetVariants = target.variants ?? [];

    if (sourceVariants.length !== targetVariants.length) {
      throw new Error(
        `Variant count mismatch for ${handle}: source=${sourceVariants.length}, target=${targetVariants.length}`
      );
    }

    return {
      id: target.id,
      title: source.title.trim(),
      handle,
      description: htmlToText(source.body_html) || null,
      external_id: String(source.id),
      status: ProductStatus.PUBLISHED,
      thumbnail: sourceImages[0]?.src ?? null,
      images: sourceImages.map(({ src }, index) => ({
        ...(target.images?.[index]?.id ? { id: target.images[index].id } : {}),
        url: src,
      })),
      metadata: {
        ...(target.metadata ?? {}),
        source: SOURCE_NAME,
        source_url: `https://www.mannabakery.au/products/${source.handle}`,
      },
      variants: sourceVariants.map((variant, index) => {
        const sourceAmount = Number(variant.price);
        if (!Number.isFinite(sourceAmount)) {
          throw new Error(
            `Invalid source price for ${handle}: ${variant.price}`
          );
        }

        const amount = adjustedProductPrice(sourceAmount);

        return {
          id: targetVariants[index].id,
          title: variant.title === "Default Title" ? "Default" : variant.title,
          sku: stableSku(source, variant),
          prices: [{ amount, currency_code: "aud" }],
          manage_inventory: false,
          metadata: {
            ...(targetVariants[index].metadata ?? {}),
            shopify_variant_id: String(variant.id),
          },
        };
      }),
    };
  });

  logger.info(
    `Approved update handles: ${updates.map(({ handle }) => handle).join(", ")}`
  );

  const { result } = await updateProductsWorkflow(container).run({
    input: { products: updates as any },
  });

  logger.info(`Updated ${result.length} approved products.`);
}
