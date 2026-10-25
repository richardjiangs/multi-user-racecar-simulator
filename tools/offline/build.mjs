import fs from 'node:fs';import vm from 'node:vm';import {gunzipSync,brotliCompress,brotliDecompressSync,constants} from 'node:zlib';import {createHash} from 'node:crypto';import {promisify} from 'node:util';
import {recipeSource,recipeFingerprint} from './recipes.mjs';
export const LITE_KEYS=['bugatti','tesla','mcf1','f1mercedes','db5','spectre','viperacr','supra','porsche919','dacia'];
const allCatalog=JSON.parse(fs.readFileSync('assets/tracks-2/pack.js','utf8').match(/^window.TRACK2_CATALOG=(.*);$/m)[1]);
const context=JSON.parse(fs.readFileSync('assets/gps/context.json','utf8')),packages=new Map(),brotli=promisify(brotliCompress);
function filter(obj,keys){return Object.fromEntries(Object.entries(obj).filter(([k])=>keys.has(k)));}
function simulatorDictionary(enc){
 const lines=[],lookup=new Map(),files={};
 for(const [key,value]of Object.entries(enc)){
  const original=gunzipSync(Buffer.from(value,'base64')).toString();
  files[key]=original.split('\n').map(line=>{if(!lookup.has(line)){lookup.set(line,lines.length);lines.push(line);}return lookup.get(line);});
  if(files[key].map(id=>lines[id]).join('\n')!==original)throw Error('Simulator text round-trip: '+key);
 }
 return{lines,files};
}
export async function prepareCompression(enc){
 const proof=JSON.parse(fs.readFileSync('tools/offline/recipe-proof.json','utf8')),corrections=JSON.parse(fs.readFileSync('tools/offline/recipe-corrections.json','utf8'));
 if(corrections.fingerprint!==proof.fingerprint||Object.keys(corrections.routes).length!==Object.keys(allCatalog.data).length)throw Error('Refresh browser arithmetic corrections with tools/offline/verify-browser-recipes.mjs');
 if(proof.fingerprint!==recipeFingerprint(allCatalog)||Object.keys(proof.routes).length!==Object.keys(allCatalog.data).length)throw Error('World recipes changed: run node tools/offline/verify-recipes.mjs first.');
 const snapshots=JSON.parse(fs.readFileSync('tools/offline/exteriors.json','utf8'));
 fs.mkdirSync('tools/offline/.cache',{recursive:true});
 for(const keys of [null,LITE_KEYS]){
  const routes=keys?new Set(keys.flatMap(key=>snapshots[key].routes)):new Set(Object.keys(allCatalog.catalog)),allowed=keys?new Set(keys):null;
  const selected=allowed?Object.fromEntries(Object.entries(enc).filter(([k])=>allowed.has(k.split('@')[0]))):enc;
  const bundle={catalog:filter(allCatalog.catalog,routes),data:filter(allCatalog.data,routes),proof:Object.fromEntries(Object.entries(filter(proof.routes,routes)).map(([name,p])=>[name,{...p,...corrections.routes[name]}])),recipe:recipeSource(),museum:JSON.parse(fs.readFileSync('tools/tracks2/museum-cars.json')),gps:keys?{...context,routes:filter(context.routes,routes)}:context,sims:simulatorDictionary(selected),exteriors:Object.fromEntries(Object.entries(snapshots).filter(([key])=>!allowed||allowed.has(key)).map(([key,value])=>[key,value.svg]))};
  const raw=Buffer.from(JSON.stringify(bundle)),hash=createHash('sha256').update(raw).digest('hex'),cache='tools/offline/.cache/bundle-'+hash+'.br';
  const packed=fs.existsSync(cache)?fs.readFileSync(cache):await brotli(raw,{params:{[constants.BROTLI_PARAM_QUALITY]:11,[constants.BROTLI_PARAM_LGWIN]:24}});
  if(!brotliDecompressSync(packed).equals(raw))throw Error('Offline archive round-trip');fs.writeFileSync(cache,packed);packages.set(keys?'lite':'full',packed.toString('base64'));
  console.log(keys?'LITE':'Full','lossless archive:',(packed.length/1048576).toFixed(2),'MiB compressed;',Object.keys(bundle.data).length,'unchanged worlds');
 }
}
export function embedded(enc,keys=null){
 const packed=packages.get(keys?'lite':'full');if(!packed)throw Error('Call prepareCompression first');
 const wasmModule=fs.readFileSync('vendor/brotli-dec-wasm/pkg/brotli_dec_wasm.js').toString('base64'),wasm=fs.readFileSync('vendor/brotli-dec-wasm/pkg/brotli_dec_wasm_bg.wasm').toString('base64');
 const runtime=fs.readFileSync('tools/offline/recipe-runtime.js','utf8');
 return `window.EMBEDDED_SIM_GZIP_BASE64=${JSON.stringify(Object.fromEntries(Object.keys(enc).map(k=>[k,true])))};
 (function(){
 ${runtime}
 const ready=import("data:text/javascript;base64,${wasmModule}").then(async m=>{
  await m.default({module_or_path:Uint8Array.from(atob("${wasm}"),c=>c.charCodeAt(0))});
  const bundle=JSON.parse(new TextDecoder().decode(m.decompress(Uint8Array.from(atob("${packed}"),c=>c.charCodeAt(0)))));
  for(const image of document.querySelectorAll('[data-offline-art]')){const svg=bundle.exteriors[image.dataset.offlineArt];if(svg)image.src=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));}
  window.MUCS_GPS_CONTEXT=bundle.gps;window.TRACK2_CATALOG={data:bundle.data,catalog:bundle.catalog};return bundle;
 });
 window.MUCS_OFFLINE_SIM_TEXT=async key=>{const {sims}=await ready;if(!sims.files[key])throw Error('This offline edition does not include that car.');return sims.files[key].map(i=>sims.lines[i]).join('\\n');};
 window.MUCS_GPS_LOADING=ready.then(b=>b.gps);
 window.TRACK2_UNPACK=window.TRACK2_READY=ready.then(installOfflineRecipes);
 })();\n`;
}
export function offlinePage(index,registry,FILES,FILES_2,enc,build,keys=null,fullEmbed=null){
 const snapshots=JSON.parse(fs.readFileSync('tools/offline/exteriors.json','utf8')),allowed=new Set(keys||Object.keys(FILES));
 const files=filter(FILES,allowed),files2=filter(FILES_2,allowed),selected=Object.fromEntries(Object.entries(enc).filter(([k])=>allowed.has(k.split('@')[0])));
 let html=index.replace(registry,`/*__EMBED_START__*/const SIM_FILES=${JSON.stringify(files)};const SIM_FILES_2=${JSON.stringify(files2)};const SIM_BUILD=${JSON.stringify(build)};${fullEmbed||embedded(selected,keys)}/*__EMBED_END__*/`)
  .replace(`if (location.protocol === "file:") document.write('<script src="sims-embedded.js"><\\/script>');`,'/* Self-contained offline edition. */')
  .replace(`if (location.protocol === "file:") {`,`if (true) { /* Embedded simulators on every protocol. */`)
  .replace(`      if (document.readyState === "complete") setTimeout(prefetchSims, 600);\n      else window.addEventListener("load", () => setTimeout(prefetchSims, 600));`,'/* Offline: no background downloads. */')
  .replace('fetch("build.txt", { cache: "no-store" })','Promise.resolve({ok:false})')
  .replace('<script src="vendor/peerjs.min.js"></script>',()=>'<script>'+fs.readFileSync('vendor/peerjs.min.js','utf8').replace(/<\/script/gi,'<\\/script')+'</script>')
  .replace('import("./vendor/trystero-nostr.min.js")',()=>`import("data:text/javascript;base64,${fs.readFileSync('vendor/trystero-nostr.min.js').toString('base64')}")`);
 html=html.replace(/<article class="car-card" data-car-card="([^"]+)"[\s\S]*?<\/article>/g,(card,key)=>{
  if(!allowed.has(key))return '';
  const snapshot=snapshots[key];if(!snapshot)throw Error('Missing exterior snapshot for '+key);
  if(snapshot.sourceHash!==createHash('sha256').update(fs.readFileSync(FILES[key])).digest('hex'))throw Error('Refresh exterior snapshot for '+key);
  if(['tesla','supra'].includes(key)&&snapshot.artHash!==createHash('sha256').update(fs.readFileSync('tools/vehicle-refinements/profile-art.js')).digest('hex'))throw Error('Refresh side-profile snapshot for '+key);
  const photo=`<div class="photo"><img class="offline-exterior" alt="${key} — simulator exterior artwork" data-offline-art="${key}" loading="lazy"></div>\n          <div class="car-info">`;
  const replaced=card.replace(/<div class="photo">[\s\S]*?<div class="car-info">/,()=>photo);if(card===replaced)throw Error('No garage artwork slot for '+key);return replaced;
 });
 html=html.replace('</head>','<style>.photo .offline-exterior{width:100%;height:100%;object-fit:contain;display:block}.photo{background:radial-gradient(ellipse at 50% 25%,#344552,#111c25 80%)}</style></head>');
 if(keys){
  html=html.replace(/const cars = (\{[\s\S]*?\n      \});/,(_,literal)=>'const cars = '+JSON.stringify(filter(vm.runInNewContext('('+literal+')'),allowed))+';');
  html=html.replace(/\d+ carefully researched simulators/,'10 carefully researched simulators').replace('<title>','<title>LITE · ').replace('aria-label="Car choices"','aria-label="LITE — ten car choices"');
  html=html.replace('<section class="cars"','<p class="settings-note">LITE edition · 10 cars · full-quality Track 1.0 and Track 2.0, including their shared circuits and individual routes.</p><section class="cars"');
 }
 return html;
}
