import fs from 'node:fs';import vm from 'node:vm';import {gzipSync,gunzipSync,brotliCompress,brotliDecompressSync,constants} from 'node:zlib';import {createHash} from 'node:crypto';import {promisify} from 'node:util';
import {decodeMesh,unshuffle} from '../tracks2/mesh-codec.mjs';
export const LITE_KEYS=['bugatti','tesla','mcf1','f1mercedes','db5','spectre','viperacr','supra','porsche919','dacia'];
const compact=value=>gzipSync(JSON.stringify(value),{level:9}).toString('base64');
const allCatalog=JSON.parse(fs.readFileSync('assets/tracks-2/pack.js','utf8').match(/^window.TRACK2_CATALOG=(.*);$/m)[1]);
const context=JSON.parse(fs.readFileSync('assets/gps/context.json','utf8')),compressed=new Map();
const brotli=promisify(brotliCompress);
export async function prepareCompression(){
 const entries=[...new Map(Object.values(allCatalog.catalog).map(e=>[e.id,e])).values()];let next=0,done=0;fs.mkdirSync('tools/offline/.cache',{recursive:true});
 await Promise.all(Array.from({length:3},async()=>{while(next<entries.length){const {id,file}=entries[next++],src=fs.readFileSync('assets/tracks-2/'+file,'utf8'),value=JSON.parse(src.slice(src.indexOf(']=')+2).trim().replace(/;$/,'')),raw=gunzipSync(Buffer.from(value.gzip,'base64')),cache='tools/offline/.cache/'+id+'-q11.br';
  const packed=fs.existsSync(cache)?fs.readFileSync(cache):await brotli(raw,{params:{[constants.BROTLI_PARAM_QUALITY]:11}});
  if(!brotliDecompressSync(packed).equals(raw))throw Error('Brotli vertex round-trip: '+file);
  fs.writeFileSync(cache,packed);const originalSize=Buffer.from(value.gzip,'base64').length;
  if(packed.length<originalSize){value.brotli=packed.toString('base64');delete value.gzip;}
  const encoded=compact(value);if(gunzipSync(Buffer.from(encoded,'base64')).toString()!==JSON.stringify(value))throw Error('Metadata round-trip: '+file);compressed.set(id,encoded);
  console.log('Lossless track package',++done+'/'+entries.length,id,Math.round(Math.min(originalSize,packed.length)/originalSize*100)+'% of gzip');
 }}));
}
function filter(obj,keys){return Object.fromEntries(Object.entries(obj).filter(([k])=>keys.has(k)));}
export function embedded(enc,keys=null){
 const snapshots=JSON.parse(fs.readFileSync('tools/offline/exteriors.json','utf8'));
 const routes=keys?new Set(keys.flatMap(key=>snapshots[key].routes)):new Set(Object.keys(allCatalog.catalog));
 const catalog=filter(allCatalog.catalog,routes),data=filter(allCatalog.data,routes),meshes={};
 for(const {id,file} of Object.values(catalog)){
  if(!compressed.has(id)){
   const src=fs.readFileSync('assets/tracks-2/'+file,'utf8'),value=JSON.parse(src.slice(src.indexOf(']=')+2).trim().replace(/;$/,''));
   const packed=compact(value);
   // Compression is a storage change only: all metadata and already-encoded
   // vertex bytes must survive byte-for-byte. Nothing is resampled or rounded.
   if(gunzipSync(Buffer.from(packed,'base64')).toString()!==JSON.stringify(value))throw Error('Track compression round-trip: '+file);
   compressed.set(id,packed);
  }
  meshes[id]=compressed.get(id);
 }
 const gps=keys?{...context,routes:filter(context.routes,routes)}:context;
 let runtime=fs.readFileSync('tools/tracks2/asset-runtime.js','utf8').replace('(function(){','(function(){\n'+unshuffle.toString()+'\n'+decodeMesh.toString()+'\n');
 runtime=runtime.replace("if(!window.TRACK2_ASSETS[entry.id])await new Promise", "if(!window.TRACK2_ASSETS[entry.id]&&window.MUCS_LOAD_TRACK_ASSET)await window.MUCS_LOAD_TRACK_ASSET(entry.id);\n   if(!window.TRACK2_ASSETS[entry.id])await new Promise");
 runtime=runtime.replace('atob(packed.gzip)','atob(packed.brotli||packed.gzip)').replace("const unpacked=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();","const unpacked=packed.brotli?(await window.MUCS_BROTLI)(bytes):await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();");
 const wasmModule=fs.readFileSync('vendor/brotli-dec-wasm/pkg/brotli_dec_wasm.js').toString('base64'),wasm=fs.readFileSync('vendor/brotli-dec-wasm/pkg/brotli_dec_wasm_bg.wasm').toString('base64');
 return `window.EMBEDDED_SIM_GZIP_BASE64=${JSON.stringify(enc)};
 (function(){
 const stored=${JSON.stringify(meshes)},pending=new Map();
 window.MUCS_BROTLI=import("data:text/javascript;base64,${wasmModule}").then(async m=>{await m.default({module_or_path:Uint8Array.from(atob("${wasm}"),c=>c.charCodeAt(0))});return m.decompress;});
 async function inflate(base64){const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));return JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());}
 window.TRACK2_ASSETS||={};
 window.MUCS_LOAD_TRACK_ASSET=async function(id){if(window.TRACK2_ASSETS[id])return; if(pending.has(id))return pending.get(id);if(!stored[id])throw Error('This offline edition does not include that route.');const job=inflate(stored[id]).then(value=>{window.TRACK2_ASSETS[id]=value;delete stored[id];});pending.set(id,job);try{await job;}finally{pending.delete(id);}};
 window.MUCS_GPS_LOADING=inflate(${JSON.stringify(compact(gps))}).then(value=>window.MUCS_GPS_CONTEXT=value);
 window.TRACK2_READY=(async()=>{window.TRACK2_CATALOG=await inflate(${JSON.stringify(compact({data,catalog}))});${runtime}\nreturn window.TRACK2_UNPACK;})();
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
  const image='data:image/svg+xml;base64,'+Buffer.from(snapshot.svg).toString('base64');
  const photo=`<div class="photo"><img class="offline-exterior" alt="${key} — simulator exterior artwork" src="${image}" loading="lazy"></div>\n          <div class="car-info">`;
  const replaced=card.replace(/<div class="photo">[\s\S]*?<div class="car-info">/,()=>photo);if(card===replaced)throw Error('No garage artwork slot for '+key);return replaced;
 });
 html=html.replace('</head>','<style>.photo .offline-exterior{width:100%;height:100%;object-fit:contain;display:block}.photo{background:radial-gradient(ellipse at 50% 25%,#344552,#111c25 80%)}</style></head>');
 if(keys){
  html=html.replace(/const cars = (\{[\s\S]*?\n      \});/,(_,literal)=>'const cars = '+JSON.stringify(filter(vm.runInNewContext('('+literal+')'),allowed))+';');
  html=html.replace('64 carefully researched simulators','10 carefully researched simulators').replace('<title>','<title>LITE · ').replace('aria-label="Car choices"','aria-label="LITE — ten car choices"');
  html=html.replace('<section class="cars"','<p class="settings-note">LITE edition · 10 cars · full-quality Track 1.0 and Track 2.0, including their shared circuits and individual routes.</p><section class="cars"');
 }
 return html;
}
