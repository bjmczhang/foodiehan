const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const base = path.join(root, 'product-images/2026-10-05');
const records = JSON.parse(fs.readFileSync(path.join(base, 'optimization-manifest.json'), 'utf8'));
const original = JSON.parse(fs.readFileSync(path.join(base, 'products.json'), 'utf8')).products;
const mode = process.argv[2];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readEnv = file => Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => { const i = line.indexOf('='); return [line.slice(0,i), line.slice(i+1).replace(/^['"]|['"]$/g,'')]; }));
async function verifyAssets() {
  if (records.length !== 132 || new Set(records.map(r => r.index)).size !== 132) throw Error('Incomplete image set');
  if (records.some(r => r.status !== 'qa-approved')) throw Error('Images must pass visual QA');
  let cursor = 0;
  const results = [];
  await Promise.all(Array.from({length:8}, async () => {
    while(cursor < records.length) {
      const r = records[cursor++];
      const response = await fetch(r.optimized_url, {signal:AbortSignal.timeout(45000)});
      if(!response.ok) throw Error('Image HTTP ' + response.status + ': ' + r.index);
      const bytes = Buffer.from(await response.arrayBuffer());
      if(sha(bytes) !== r.optimized_sha256) throw Error('Image checksum mismatch: ' + r.index);
      results.push({index:r.index,url:r.optimized_url,bytes:bytes.length,sha256:sha(bytes)});
    }
  }));
  fs.writeFileSync(path.join(base, 'live-image-verification.json'), JSON.stringify({verified_at:new Date().toISOString(),images:results.sort((a,b)=>a.index-b.index)},null,2));
  console.log(JSON.stringify({verified:results.length,bytes:results.reduce((n,r)=>n+r.bytes,0)}));
}
async function database() {
  if(!['replace','check','rollback'].includes(mode)) throw Error('Use assets, check, replace or rollback');
  if(mode==='replace') await verifyAssets();
  const {Client} = require(path.join(root, 'foodiehan/node_modules/.pnpm/pg@8.20.0/node_modules/pg'));
  const client = new Client({connectionString:readEnv(path.join(root,'foodiehan/.env')).DATABASE_URL,ssl:{rejectUnauthorized:false},connectionTimeoutMillis:12000,statement_timeout:30000});
  await client.connect();
  try {
    await client.query('BEGIN');
    const ids = [...new Set(records.map(r=>r.product_id))];
    const products = (await client.query('SELECT id,title,handle,thumbnail FROM public.product WHERE id = ANY($1::text[]) AND deleted_at IS NULL FOR UPDATE',[ids])).rows;
    const images = (await client.query('SELECT id,product_id,url,rank FROM public.image WHERE product_id = ANY($1::text[]) AND deleted_at IS NULL FOR UPDATE',[ids])).rows;
    const find = (id,url) => records.find(r=>r.product_id===id && r.original_url===url);
    let thumbnailCount=0,imageCount=0;
    for(const product of products) {
      const before = original.find(p=>p.id===product.id);
      const r=find(product.id,before.thumbnail);
      const expected=mode==='rollback' ? r?.optimized_url : before.thumbnail;
      if(mode==='check') {if(r && product.thumbnail!==r.optimized_url) throw Error('Thumbnail mismatch: '+product.handle);continue;}
      if(product.thumbnail!==expected) throw Error('Product changed since backup: '+product.handle);
      if(r) {await client.query('UPDATE public.product SET thumbnail=$1,updated_at=NOW() WHERE id=$2',[mode==='rollback'?r.original_url:r.optimized_url,product.id]);thumbnailCount++;}
    }
    for(const image of images) {
      const before=original.find(p=>p.id===image.product_id)?.images.find(i=>i.id===image.id);
      if(!before) throw Error('New gallery image found: '+image.id);
      const r=find(image.product_id,before.url);
      if(!r) throw Error('Missing image mapping: '+image.id);
      if(mode==='check') {if(image.url!==r.optimized_url) throw Error('Gallery mismatch: '+image.id);continue;}
      if(image.url!==(mode==='rollback'?r.optimized_url:before.url)) throw Error('Gallery changed since backup: '+image.id);
      await client.query('UPDATE public.image SET url=$1,updated_at=NOW() WHERE id=$2',[mode==='rollback'?r.original_url:r.optimized_url,image.id]);imageCount++;
    }
    if(mode!=='check') {
      if(products.length!==88 || thumbnailCount!==88 || imageCount!==132) throw Error('Unexpected replacement counts: '+JSON.stringify({products:products.length,thumbnailCount,imageCount}));
      const backupFile=path.join(base,mode==='replace'?'database-before-replacement.json':'database-before-rollback.json');
      if(fs.existsSync(backupFile)) throw Error('Backup already exists; inspect before retry');
      fs.writeFileSync(backupFile,JSON.stringify({created_at:new Date().toISOString(),products,images},null,2));
    }
    await client.query('COMMIT');
    const report={mode,at:new Date().toISOString(),products:products.length,galleryImages:images.length,thumbnailCount,imageCount};
    fs.writeFileSync(path.join(base,'database-'+mode+'-result.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report));
  } catch(error) {await client.query('ROLLBACK');throw error;} finally {await client.end();}
}
(mode==='assets'?verifyAssets():database()).catch(error=>{console.error(error.message);process.exitCode=1;});
