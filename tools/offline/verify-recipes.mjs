// Verify EVERY reconstructed vertex, colour, material and spatial batch against
// the published immutable meshes. The report is bound to all source/input bytes.
import fs from'node:fs';import vm from'node:vm';import{gunzipSync}from'node:zlib';import{createHash}from'node:crypto';import assert from'node:assert/strict';
import{decodeMesh}from'../tracks2/mesh-codec.mjs';import{recipeSource,recipeFingerprint}from'./recipes.mjs';
const pack=JSON.parse(fs.readFileSync('assets/tracks-2/pack.js','utf8').match(/^window.TRACK2_CATALOG=(.*);$/m)[1]),fingerprint=recipeFingerprint(pack),cache='tools/offline/.cache/recipe-proof-'+fingerprint+'.json',museum=JSON.parse(fs.readFileSync('tools/tracks2/museum-cars.json'));
fs.mkdirSync('tools/offline/.cache',{recursive:true});const proof=fs.existsSync(cache)?JSON.parse(fs.readFileSync(cache)): {fingerprint,routes:{}};
const build=vm.runInNewContext('('+recipeSource()+')',{Math,ArrayBuffer,DataView,Uint8Array,console});let i=0;
for(const[name,t]of Object.entries(pack.data)){
 i++;if(proof.routes[name]){console.log(i,'verified cache',name);continue;}
 const begin=performance.now(),w=build(name,structuredClone(t),museum),entry=pack.catalog[name],src=fs.readFileSync('assets/tracks-2/'+entry.file,'utf8'),m=JSON.parse(src.slice(src.indexOf(']=')+2).trim().replace(/;$/,''));
 const old=Buffer.from(decodeMesh(gunzipSync(Buffer.from(m.gzip,'base64')),m.codec,m.vertices)),now=Buffer.from(w.buffer);
 assert.equal(w.vertices,m.vertices,name+' vertex count');assert.ok(now.equals(old),name+' vertex bytes differ');assert.equal(JSON.stringify(w.batches),JSON.stringify(m.batches),name+' spatial batches');
 proof.routes[name]={vertices:w.vertices,sha256:createHash('sha256').update(now).digest('hex'),batchesSha256:createHash('sha256').update(JSON.stringify(w.batches)).digest('hex')};
 fs.writeFileSync(cache,JSON.stringify(proof,null,2));console.log(i,name,((performance.now()-begin)/1000).toFixed(1)+'s','BYTE-EXACT');
}
fs.writeFileSync('tools/offline/recipe-proof.json',JSON.stringify(proof,null,2));console.log('PASS:',Object.keys(proof.routes).length,'complete worlds exactly match their original meshes.');
