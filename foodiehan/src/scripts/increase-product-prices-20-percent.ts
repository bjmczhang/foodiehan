import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductVariantsWorkflow } from "@medusajs/medusa/core-flows";
import {
  adjustedProductPrice,
  PRODUCT_PRICE_MULTIPLIER,
} from "./utils/product-price-adjustment";

const APPLY_ENV = "APPLY_PRODUCT_PRICE_INCREASE";
const MARKER_KEY = "price_increase_2026_08_24_20_percent";
function increasedAmount(amount: number, currencyCode: string) {
  if (currencyCode.toLowerCase() === "aud") {
    return adjustedProductPrice(amount);
  }

  const fractionDigits =
    new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  const scale = 10 ** fractionDigits;

  return (
    Math.round((amount * PRODUCT_PRICE_MULTIPLIER + Number.EPSILON) * scale) /
    scale
  );
}

export default async function increaseProductPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const apply = process.env[APPLY_ENV] === "true";

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "status",
      "variants.id",
      "variants.title",
      "variants.metadata",
      "variants.price_set.prices.id",
      "variants.price_set.prices.amount",
      "variants.price_set.prices.currency_code",
      "variants.price_set.prices.price_list_id",
      "variants.price_set.prices.min_quantity",
      "variants.price_set.prices.max_quantity",
    ],
  });

  const updates: any[] = [];
  const preview: string[] = [];
  let alreadyUpdated = 0;
  let variantsWithoutBasePrices = 0;
  let priceListPrices = 0;

  for (const product of products as any[]) {
    for (const variant of product.variants ?? []) {
      if (variant.metadata?.[MARKER_KEY] === true) {
        alreadyUpdated++;
        continue;
      }

      const prices = variant.price_set?.prices ?? [];
      const basePrices = prices.filter((price: any) => !price.price_list_id);
      priceListPrices += prices.length - basePrices.length;

      if (!basePrices.length) {
        variantsWithoutBasePrices++;
        continue;
      }

      const adjustedPrices = basePrices.map((price: any) => ({
        amount: increasedAmount(Number(price.amount), price.currency_code),
        currency_code: price.currency_code,
        ...(price.min_quantity == null
          ? {}
          : { min_quantity: price.min_quantity }),
        ...(price.max_quantity == null
          ? {}
          : { max_quantity: price.max_quantity }),
      }));

      updates.push({
        id: variant.id,
        metadata: {
          ...(variant.metadata ?? {}),
          [MARKER_KEY]: true,
        },
        prices: adjustedPrices,
      });

      preview.push(
        `${product.title} / ${variant.title}: ${basePrices
          .map(
            (price: any, index: number) =>
              `${price.currency_code.toUpperCase()} ${Number(
                price.amount
              ).toFixed(2)} -> ${adjustedPrices[index].amount.toFixed(2)}`
          )
          .join(", ")}`
      );
    }
  }

  logger.info(`Mode: ${apply ? "COMMIT" : "PREVIEW"}`);
  logger.info(`Products scanned: ${products.length}`);
  logger.info(`Variants to update: ${updates.length}`);
  logger.info(`Variants already updated: ${alreadyUpdated}`);
  logger.info(`Variants without base prices: ${variantsWithoutBasePrices}`);
  logger.info(`Price-list prices left unchanged: ${priceListPrices}`);
  preview.forEach((line) => logger.info(line));

  if (!apply) {
    logger.info(
      `No changes made. Set ${APPLY_ENV}=true to apply this migration.`
    );
    return;
  }

  if (priceListPrices) {
    throw new Error(
      `Refusing to apply: found ${priceListPrices} price-list prices that need separate handling.`
    );
  }

  if (!updates.length) {
    logger.info("Nothing to update.");
    return;
  }

  const { result } = await updateProductVariantsWorkflow(container).run({
    input: { product_variants: updates },
  });

  logger.info(`Updated ${result.length} product variants by 20%.`);
}
