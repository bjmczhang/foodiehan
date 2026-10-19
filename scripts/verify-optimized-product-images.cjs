const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'product-images/2026-10-05');
const rows=JSON.parse(fs.readFileSync(path.join(base,'optimization-manifest.json'),'utf8'));
const env=Object.fromEntries(fs.readFileSync(path.join(root,'foodiehan-storefront/.env.local'),'utf8').split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).replace(/^['"]|['"]$/g,'')];}));
async function main(){
  const response=await fetch('https://admin.foodiehan.com.au/store/products?limit=100&fields=id,title,handle,thumbnail,*images',{headers:{'x-publishable-api-key':env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY},signal:AbortSignal.timeout(45000)});
  if(!response.ok)throw Error('Store API HTTP '+response.status);
  const inventory=await response.json();
  let thumbs=0,gallery=0;
  for(const p of inventory.products){
    const expected=rows.filter(r=>r.product_id===p.id);
    if(!expected.length)continue;
    if(!expected.some(r=>r.optimized_url===p.thumbnail))throw Error('Store thumbnail mismatch: '+p.handle);
    thumbs++;
    for(const i of p.images){if(!expected.some(r=>r.optimized_url===i.url))throw Error('Store gallery mismatch: '+p.handle);gallery++;}
  }
  if(thumbs!==88||gallery!==132)throw Error('Store image counts mismatch');
  const routes=['/au/store','/au/products/red-bean-bun','/au/products/assorted-cookie-set','/au/products/strawberry-cake'];
  const pages=[];
  for(const route of routes){
    const r=await fetch('https://www.foodiehan.com.au'+route,{signal:AbortSignal.timeout(60000),headers:{'Cache-Control':'no-cache'}});
    const html=await r.text();
    if(!r.ok || !html.includes('optimized-style-3') || html.includes('Let’s try that again.'))throw Error('Page verification failed: '+route+' HTTP '+r.status);
    fs.writeFileSync(path.join(base,'qa',route.split('/').pop()+'.html'),html);
    pages.push({route,status:r.status,newImageReferences:(html.match(/optimized-style-3/g)||[]).length});
  }
  const transforms=[];
  for(const index of [0,110,131]){
    const r=rows[index];
    const url='https://www.foodiehan.com.au/_next/image?url='+encodeURIComponent(r.optimized_url)+'&w=640&q=75';
    const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
    const bytes=Buffer.from(await response.arrayBuffer());
    if(!response.ok || !response.headers.get('content-type')?.startsWith('image/'))throw Error('Image transform failed: '+index);
    fs.writeFileSync(path.join(base,'qa','live-'+index+'.webp'),bytes);
    transforms.push({index,status:response.status,bytes:bytes.length,contentType:response.headers.get('content-type')});
  }
  const report={verified_at:new Date().toISOString(),storeProductCount:inventory.count,thumbnails:thumbs,galleryImages:gallery,pages,transforms};
  fs.writeFileSync(path.join(base,'live-store-verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
