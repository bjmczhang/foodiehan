const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const base = path.join(root, 'product-images/2026-10-05');
const sharp = require(path.join(root, 'foodiehan-storefront/node_modules/.pnpm/sharp@0.34.5/node_modules/sharp'));
const rows = JSON.parse(fs.readFileSync(path.join(base, 'manifest.json'), 'utf8'));
const stateFile = path.join(base, 'optimization-manifest.json');
const readState = () => fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : [];
const xml = text => String(text).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;'}[character]));

async function accept(index, source) {
  const row = rows[index];
  if (!row) throw new Error('Invalid image index');
  const state = readState();
  if (state.some(record => record.index === index)) throw new Error('Image already optimized: ' + index);
  const folder = path.dirname(row.local_file).replace(/^originals/, 'optimized-masters');
  const filename = path.basename(row.local_file).replace(/\.[^.]+$/, '.png');
  const master = path.join(base, folder, filename);
  fs.mkdirSync(path.dirname(master), { recursive: true });
  fs.copyFileSync(source, master);
  const publicPath = `/images/products/optimized-style-3/${row.product_id}/${String(row.image_index).padStart(2, '0')}.webp`;
  const webp = path.join(root, 'foodiehan-storefront/public', publicPath);
  fs.mkdirSync(path.dirname(webp), { recursive: true });
  await sharp(master).rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, effort: 6 }).toFile(webp);
  const metadata = await sharp(webp).metadata();
  if (!metadata.width || !metadata.height) throw new Error('Invalid optimized image');
  const bytes = fs.readFileSync(webp);
  const record = { index, ...row, optimized_master: path.relative(base, master).replaceAll('\\', '/'), optimized_public_path: publicPath, optimized_url: 'https://www.foodiehan.com.au' + publicPath, optimized_bytes: bytes.length, optimized_sha256: crypto.createHash('sha256').update(bytes).digest('hex'), width: metadata.width, height: metadata.height, style: 3, status: 'optimized-pending-qa' };
  state.push(record);
  state.sort((a, b) => a.index - b.index);
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
  console.log(JSON.stringify({completed:state.length, index, product:row.product_handle, publicPath, bytes:bytes.length}));
}

async function sheet(start, end, optimized) {
  const state = readState();
  const selected = rows.map((row,index) => ({row,index})).filter(({index}) => index >= start && index < end);
  const tileW = 384, tileH = 416, columns = 4;
  const tiles = [];
  for (let i = 0; i < selected.length; i++) {
    const {row,index} = selected[i];
    const record = state.find(record => record.index === index);
    const input = optimized ? record && path.join(base, record.optimized_master) : path.join(base,row.local_file);
    const preview = input ? await sharp(input).resize(364,364,{fit:'contain',background:'#eee8dd'}).flatten({background:'#eee8dd'}).png().toBuffer() : await sharp({create:{width:364,height:364,channels:3,background:'#ddd'}}).png().toBuffer();
    const x = (i % columns)*tileW, y = Math.floor(i/columns)*tileH;
    tiles.push({input:preview,left:x+10,top:y+5});
    const label = `${index}: ${row.product_handle} / ${row.image_index}`;
    tiles.push({input:Buffer.from(`<svg width="384" height="42"><rect width="384" height="42" fill="white"/><text x="8" y="24" font-size="13" font-family="Arial">${xml(label)}</text></svg>`),left:x,top:y+372});
  }
  const output = path.join(base,'qa',`${optimized?'optimized':'original'}-${start}-${end}.jpg`);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  await sharp({create:{width:columns*tileW,height:Math.ceil(selected.length/columns)*tileH,channels:3,background:'#ffffff'}}).composite(tiles).jpeg({quality:90}).toFile(output);
  console.log(output);
}

async function main() {
  const [command,...args] = process.argv.slice(2);
  if (command === 'accept') await accept(Number(args[0]), args[1]);
  else if (command === 'sheet') await sheet(Number(args[0]), Number(args[1]), args[2] === 'optimized');
  else if (command === 'status') console.log(JSON.stringify({total:rows.length,completed:readState().length,pending:rows.map((row,index)=>index).filter(index=>!readState().some(record=>record.index===index))}));
  else throw new Error('Expected accept, sheet or status');
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
