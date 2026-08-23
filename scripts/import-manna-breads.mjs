#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const COLLECTION_URL =
  "https://www.mannabakery.au/collections/all-breads/products.json?limit=250";
const DEFAULT_OUTPUT = "src/data/manna-breads.json";

const outputArgIndex = process.argv.indexOf("--output");
const outputPath = resolve(
  outputArgIndex >= 0 && process.argv[outputArgIndex + 1]
    ? process.argv[outputArgIndex + 1]
    : DEFAULT_OUTPUT,
);

function decodeHtmlEntities(value) {
  const namedEntities = {
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

  return value.replace(
    /&(#\d+|#x[\da-f]+|[a-z]+);/gi,
    (entity, code) => {
      if (code[0] !== "#") return namedEntities[code.toLowerCase()] ?? entity;

      const isHex = code[1].toLowerCase() === "x";
      const point = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    },
  );
}

function htmlToText(html = "") {
  return decodeHtmlEntities(
    String(html ?? "")
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])\s*>/gi, "\n")
      .replace(/<li(?:\s[^>]*)?>/gi, "• ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\r/g, "")
    .replace(/[\t ]+\n/g, "\n")
    .replace(/\n[\t ]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatPrice(variants = []) {
  const prices = variants
    .map(({ price }) => Number(price))
    .filter(Number.isFinite);

  if (prices.length === 0) return "";

  const minimum = Math.min(...prices).toFixed(2);
  const maximum = Math.max(...prices).toFixed(2);

  return minimum === maximum ? `$${minimum}` : `$${minimum} – $${maximum}`;
}

async function fetchProducts() {
  const response = await fetch(COLLECTION_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "foodiehan-product-import/1.0",
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Manna Bakery returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.products)) {
    throw new Error("Unexpected response: products is not an array");
  }

  return payload.products.map((product) => ({
    handle: product.handle.trim(),
    title: product.title.trim(),
    price: formatPrice(product.variants),
    desc: htmlToText(product.body_html),
    thumbnail: product.images?.[0]?.src ?? null,
    images: (product.images ?? []).map(({ src }) => src),
  }));
}

try {
  const products = await fetchProducts();

  if (products.length === 0) {
    throw new Error("The collection returned no products; output was not changed");
  }

  const incompleteProducts = products.filter(({ title, price }) => !title || !price);

  if (incompleteProducts.length > 0) {
    const titles = incompleteProducts.map(({ title }) => title || "(untitled)");
    throw new Error(
      `Found ${incompleteProducts.length} product(s) with missing title or price: ${titles.join(
        ", ",
      )}`,
    );
  }

  const productsWithoutDescriptions = products.filter(({ desc }) => !desc);
  if (productsWithoutDescriptions.length > 0) {
    console.warn(
      `Warning: ${productsWithoutDescriptions.length} source product(s) have no description: ${productsWithoutDescriptions
        .map(({ title }) => title)
        .join(", ")}`,
    );
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  console.log(`Imported ${products.length} products to ${outputPath}`);
} catch (error) {
  console.error(`Import failed: ${error.message}`);
  process.exitCode = 1;
}
