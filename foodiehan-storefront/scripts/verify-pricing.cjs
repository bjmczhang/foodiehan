const assert = require("node:assert/strict")
const ts = require("typescript")
const fs = require("fs")
require.extensions[".ts"] = (module, file) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
    file
  )
const {
  getPricesForVariant,
  getProductPrice,
} = require("../src/lib/util/get-product-price.ts")
const { getPercentageDiff } = require("../src/lib/util/get-percentage-diff.ts")
assert.equal(
  getPricesForVariant({
    calculated_price: {
      calculated_amount: 0,
      original_amount: 0,
      currency_code: "aud",
    },
  }).calculated_price_number,
  0
)
assert.equal(getPercentageDiff(0, 0), "0")
assert.equal(
  getPricesForVariant({
    calculated_price: { calculated_amount: 10, currency_code: "aud" },
  }).original_price_number,
  10
)
assert.equal(
  getPricesForVariant({ calculated_price: { currency_code: "aud" } }),
  null
)
const product = {
  id: "test",
  variants: [
    { id: "no-price" },
    {
      id: "zero",
      calculated_price: { calculated_amount: 0, currency_code: "aud" },
    },
    {
      id: "paid",
      calculated_price: { calculated_amount: 5, currency_code: "aud" },
    },
  ],
}
assert.equal(
  getProductPrice({ product }).cheapestPrice.calculated_price_number,
  0
)
assert.equal(
  getProductPrice({ product, variantId: "paid" }).variantPrice
    .calculated_price_number,
  5
)
assert.equal(
  getProductPrice({ product, variantId: "missing" }).variantPrice,
  null
)
console.log(
  "PASS: 7 price edge-case checks (zero, absent prices, original fallback, variant selection)."
)
