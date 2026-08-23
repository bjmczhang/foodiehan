export const PRODUCT_PRICE_MULTIPLIER = 1.2;

export function adjustedProductPrice(amount: number) {
  return (
    Math.round((amount * PRODUCT_PRICE_MULTIPLIER + Number.EPSILON) * 100) / 100
  );
}
