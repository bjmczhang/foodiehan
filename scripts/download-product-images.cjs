const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const backend = 'https://admin.foodiehan.com.au';
const storefront = 'https://foodiehan.com.au';
const output = path.join(root, 'product-images', '2026-10-05');
const readEnv = (file) => Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1).replace(/^['"]|['"]$/g, '')]; }));
const slug = (value) => String(value || 'image').normalize('NFKC').replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 100) || 'image';
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const csv = (rows, fields) => '\uFEFF' + [fields, ...rows.map(row => fields.map(field => row[field] ?? ''))].map(row => row.map(value => '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\r\n');

async function getProducts() {
  let client;
  try {
    const { Client } = require(path.join(root, 'foodiehan/node_modules/.pnpm/pg@8.20.0/node_modules/pg'));
    client = new Client({ connectionString: readEnv(path.join(root, 'foodiehan/.env')).DATABASE_URL, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 12000, statement_timeout: 20000 });
    await client.connect();
    await client.query('BEGIN READ ONLY');
    const products = (await client.query('SELECT id, title, handle, status, thumbnail FROM public.product WHERE deleted_at IS NULL ORDER BY id')).rows;
    const images = (await client.query('SELECT id, product_id, url, rank FROM public.image WHERE deleted_at IS NULL ORDER BY product_id, rank, id')).rows;
    for (const product of products) product.images = images.filter(image => image.product_id === product.id);
    await client.query('COMMIT');
    console.log('Full database inventory:', products.length, 'products;', images.length, 'gallery images');
    return { source: 'database-all-non-deleted-products', complete: true, products };
  } catch (error) {
    console.log('Database inventory unavailable:', error.message);
  } finally {
    if (client) await client.end().catch(() => {});
  }
  const key = readEnv(path.join(root, 'foodiehan-storefront/.env.local')).NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  const products = [];
  let count = Infinity;
  while (products.length < count) {
    const url = `${backend}/store/products?limit=100&offset=${products.length}&fields=id,title,handle,thumbnail,*images`;
    const response = await fetch(url, { headers: { 'x-publishable-api-key': key }, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Products API HTTP ${response.status}`);
    const page = await response.json();
    count = page.count;
    if (!Array.isArray(page.products) || !page.products.length) { if (products.length < count) throw new Error('Incomplete product pagination'); break; }
    products.push(...page.products);
    console.log('Store inventory:', products.length, '/', count);
  }
  return { source: 'store-api-published-products', complete: false, products };
}

function extension(bytes, mime) {
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return '.jpg';
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return '.png';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return '.webp';
  if (bytes.toString('ascii', 0, 3) === 'GIF') return '.gif';
  if (bytes.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(bytes.toString('ascii', 8, 40))) return '.avif';
  if (mime.includes('svg') && /<svg\b/.test(bytes.toString('utf8', 0, 1000))) return '.svg';
  throw new Error('Response is not a recognized image');
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const inventory = await getProducts();
  fs.writeFileSync(path.join(output, 'products.json'), JSON.stringify(inventory, null, 2));
  const rows = [];
  const productsWithoutImages = [];
  for (const product of inventory.products) {
    const urls = new Map();
    if (product.thumbnail) urls.set(product.thumbnail, ['thumbnail']);
    for (const image of product.images || []) {
      if (!image.url) continue;
      const roles = urls.get(image.url) || [];
      roles.push('gallery');
      urls.set(image.url, [...new Set(roles)]);
    }
    if (!urls.size) productsWithoutImages.push(product);
    let index = 0;
    for (const [url, roles] of urls) rows.push({ product_id: product.id, product_title: product.title, product_handle: product.handle, product_status: product.status || 'published', role: roles.join('+'), image_index: ++index, original_url: url, local_file: '', downloaded_url: '', bytes: 0, sha256: '', status: 'pending', error: '' });
  }
  const cache = new Map();
  async function loadImage(original) {
    const urls = /^https?:\/\//i.test(original) ? [original] : original.startsWith('//') ? ['https:' + original] : [new URL(original, storefront).href, new URL(original, backend).href];
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      for (const url of [...new Set(urls)]) {
        try {
          const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const bytes = Buffer.from(await response.arrayBuffer());
          const ext = extension(bytes, response.headers.get('content-type') || '');
          return { bytes, ext, url: response.url };
        } catch (error) { lastError = new Error(`${url}: ${error.message}`); }
      }
      if (attempt < 2) await pause(1000 * (attempt + 1));
    }
    throw lastError;
  }
  let next = 0;
  let done = 0;
  async function worker() {
    while (next < rows.length) {
      const row = rows[next++];
      try {
        if (!cache.has(row.original_url)) cache.set(row.original_url, loadImage(row.original_url));
        const image = await cache.get(row.original_url);
        const folder = slug(row.product_handle || row.product_title) + '__' + row.product_id;
        const basename = slug(path.basename(new URL(row.original_url, storefront).pathname).replace(/\.[^.]+$/, ''));
        const filename = String(row.image_index).padStart(2, '0') + '-' + basename + image.ext;
        row.local_file = path.posix.join('originals', folder, filename);
        const target = path.join(output, row.local_file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, image.bytes);
        row.downloaded_url = image.url;
        row.bytes = image.bytes.length;
        row.sha256 = crypto.createHash('sha256').update(image.bytes).digest('hex');
        row.status = 'downloaded';
      } catch (error) { row.status = 'failed'; row.error = error.message; console.log('FAILED', row.product_handle, row.original_url, error.message); }
      done++;
      if (done % 10 === 0 || done === rows.length) console.log('Images processed:', done, '/', rows.length);
      fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(rows, null, 2));
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  fs.writeFileSync(path.join(output, 'manifest.csv'), csv(rows, ['product_id', 'product_title', 'product_handle', 'product_status', 'role', 'image_index', 'original_url', 'local_file', 'downloaded_url', 'bytes', 'sha256', 'status', 'error']));
  fs.writeFileSync(path.join(output, 'products-without-images.csv'), csv(productsWithoutImages, ['id', 'title', 'handle', 'status']));
  const summary = { source: inventory.source, complete_product_inventory: inventory.complete, products: inventory.products.length, products_without_images: productsWithoutImages.length, image_entries: rows.length, unique_source_urls: new Set(rows.map(row => row.original_url)).size, downloaded: rows.filter(row => row.status === 'downloaded').length, failed: rows.filter(row => row.status === 'failed').length, total_bytes: rows.reduce((sum, row) => sum + row.bytes, 0), output };
  fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(output, 'README.txt'), '产品原始图片备份\r\n\r\noriginals/：按产品 handle 和 ID 分文件夹。文件名前两位为图片顺序。\r\nmanifest.csv：产品、原链接、本地文件及 SHA-256 校验值，可用 Excel 打开。\r\nproducts.json：本次导出的产品图片清单。\r\nproducts-without-images.csv：没有缩略图或图库图片的产品。\r\nsummary.json：下载结果。\r\n\r\n图片保留原始格式和字节，未压缩、修改或上传。建议把优化结果放到单独文件夹并保留原始文件。\r\n' + (inventory.complete ? '产品清单来自数据库，包括已上架和未上架产品（排除已删除产品）。' : '产品清单来自公开商城 API，仅覆盖当前发布到该销售渠道的产品，不能确认是否包含后台全部产品。'));
  console.log(JSON.stringify(summary, null, 2));
  if (summary.failed) process.exitCode = 2;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
