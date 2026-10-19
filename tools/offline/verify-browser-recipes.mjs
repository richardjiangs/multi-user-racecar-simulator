// Browser arithmetic can differ by a few ULPs. Save only exact replacement words
// and original batch bounds; applying those words is a no-op on matching engines.
import fs from'node:fs';import http from'node:http';import{gunzipSync}from'node:zlib';import{createRequire}from'node:module';import{createHash}from'node:crypto';import assert from'node:assert/strict';
import{recipeSource,recipeFingerprint}from'./recipes.mjs';import{decodeMesh}from'../tracks2/mesh-codec.mjs';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),pw=require('playwright');
const pack=JSON.parse(fs.readFileSync('assets/tracks-2/pack.js','utf8').match(/^window.TRACK2_CATALOG=(.*);$/m)[1]),fingerprint=recipeFingerprint(pack),museum=JSON.parse(fs.readFileSync('tools/tracks2/museum-cars.json')),engines=process.argv.slice(2).length?process.argv.slice(2):['chromium','webkit','firefox'];
const source=recipeSource(),output={fingerprint,engines:{},routes:{}};
function packed(name){const s=fs.readFileSync('assets/tracks-2/'+pack.catalog[name].file,'utf8');return JSON.parse(s.slice(s.indexOf(']=')+2).trim().replace(/;$/,''));}
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/mesh'){const name=url.searchParams.get('name');if(!pack.catalog[name]){res.writeHead(404);res.end();return;}const m=packed(name);res.writeHead(200,{'Content-Type':'application/octet-stream'});res.end(Buffer.from(decodeMesh(gunzipSync(Buffer.from(m.gzip,'base64')),m.codec,m.vertices)));}else{res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><title>Local world archive verification</title>');}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
try{
 const reports=await Promise.all(engines.map(async engine=>{
  const browser=await pw[engine].launch(),page=await browser.newPage(),version=browser.version(),cache='tools/offline/.cache/browser-'+engine+'-'+version+'-'+fingerprint+'.json';page.setDefaultTimeout(180000);await page.goto(base);
  const report=fs.existsSync(cache)?JSON.parse(fs.readFileSync(cache)): {engine,version,fingerprint,routes:{}};let n=0;
  try{for(const[name,track]of Object.entries(pack.data)){
   n++;if(report.routes[name])continue;const start=performance.now();
   const result=await page.evaluate(({source,name,track,museum,url})=>new Promise((resolve,reject)=>{
    const script=source+`;onmessage=async e=>{try{const {name,track,museum,url}=e.data,original=await(await fetch(url)).arrayBuffer(),mesh=reconstructTrack(name,track,museum),a=new DataView(mesh.buffer),b=new DataView(original);if(a.byteLength!==b.byteLength)throw Error('Vertex count changed');const patches=[];for(let i=0;i<a.byteLength;i+=4)if(a.getUint32(i,true)!==b.getUint32(i,true))patches.push([i,b.getUint32(i,true)]);postMessage({patches,vertices:mesh.vertices,batches:mesh.batches});}catch(error){postMessage({error:error.message});}};`;
    const u=URL.createObjectURL(new Blob([script],{type:'text/javascript'})),w=new Worker(u);w.onmessage=e=>{w.terminate();URL.revokeObjectURL(u);if(e.data.error)reject(Error(e.data.error));else resolve(e.data);};w.onerror=e=>{w.terminate();URL.revokeObjectURL(u);reject(Error(e.message));};w.postMessage({name,track,museum,url});
   }),{source,name,track,museum,url:base+'/mesh?name='+encodeURIComponent(name)});
   const original=packed(name);assert.equal(result.vertices,original.vertices,name);
   assert.equal(JSON.stringify(result.batches.map(b=>[b.first,b.count])),JSON.stringify(original.batches.map(b=>[b.first,b.count])),engine+' '+name+' topology differs');
   report.routes[name]={patches:result.patches};fs.writeFileSync(cache,JSON.stringify(report));console.log(engine,n,name,result.patches.length,'correction words',((performance.now()-start)/1000).toFixed(1)+'s');
  }}finally{await browser.close();}return report;
 }));
 for(const report of reports)output.engines[report.engine]=report.version;
 for(const[name]of Object.entries(pack.data)){const words=new Map();for(const report of reports)for(const[i,v]of report.routes[name].patches){assert.ok(!words.has(i)||words.get(i)===v);words.set(i,v);}output.routes[name]={patches:[...words].sort((a,b)=>a[0]-b[0]),batches:packed(name).batches};}
 fs.writeFileSync(process.env.RECIPE_CORRECTION_OUTPUT||'tools/offline/recipe-corrections.json',JSON.stringify(output));console.log('PASS browser arithmetic corrections',Object.keys(output.routes).length,'routes',Object.values(output.routes).reduce((n,r)=>n+r.patches.length,0),'words');
}finally{server.close();}
