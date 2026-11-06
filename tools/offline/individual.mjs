// Each download is a portable, lossless copy of one current garage simulator.
// Both editions are kept; no changes are made to root-level simulator sources.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';
import {gzipSync,gunzipSync,brotliCompress,brotliDecompressSync,constants} from 'node:zlib';
import {promisify} from 'node:util';import {createHash} from 'node:crypto';
import {recipeSource,recipeFingerprint} from './recipes.mjs';
import {encodeTables,decodeTables} from './numeric-tables.mjs';
const br=promisify(brotliCompress),sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p)),select=(o,names)=>Object.fromEntries(Object.entries(o).filter(([k])=>names.has(k)));
const files=json('tools/tracks2/sim-files.json'),files2=json('tools/tracks2/manifest.json'),snapshots=json('tools/offline/exteriors.json');
const catalog=JSON.parse(read('assets/tracks-2/pack.js').match(/^window.TRACK2_CATALOG=(.*);$/m)[1]),gps=json('assets/gps/context.json');
const proof=json('tools/offline/recipe-proof.json'),corrections=json('tools/offline/recipe-corrections.json');
if(recipeFingerprint(catalog)!==proof.fingerprint||corrections.fingerprint!==proof.fingerprint)throw Error('World recipe integrity proof is stale.');
const driving=['runtime','traffic-art','db5-art','profile-art','road-art','city-network','london-data','london-map','london-sedans','prepare'].map(n=>read('tools/vehicle-refinements/'+n+'.js')).join('\n')+'\n'+read('tools/driving/controls.js');
const navigation=read('tools/gps/navigation.js'),context={window:{}};vm.runInNewContext(driving+'\n'+navigation,context);
const runtime=read('tools/offline/recipe-runtime.js'),recipe=recipeSource(),museum=json('tools/tracks2/museum-cars.json');
const decoder=gzipSync(Buffer.from(JSON.stringify({js:read('vendor/brotli-dec-wasm/pkg/brotli_dec_wasm.js'),wasm:fs.readFileSync('vendor/brotli-dec-wasm/pkg/brotli_dec_wasm_bg.wasm').toString('base64')})),{level:9}).toString('base64');
const decoderLicense=read('vendor/brotli-dec-wasm/LICENSE-MIT.txt');
const output='offline-cars',cache='tools/offline/.cache/individual';fs.mkdirSync(cache,{recursive:true});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function page(bundle,packed,codec,format){
 const metadata={key:bundle.key,version:bundle.version,app:bundle.app,sourceSha256:bundle.sourceSha256,preparedSha256:bundle.preparedSha256,codec,format};
 return `<!doctype html>${codec==='br'?'<!-- Brotli decoder license\n'+decoderLicense+'-->':''}<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escape(bundle.title)} · offline</title><style>html,body{width:100%;height:100%;margin:0;background:#10212c;color:#edf8ff;font:16px system-ui}iframe{position:fixed;inset:0;width:100%;height:100%;border:0}#loading{position:fixed;inset:0;display:grid;place-content:center;padding:24px;z-index:2;text-align:center}</style></head><body><div id="loading">Opening ${escape(bundle.title)}…</div><iframe id="simFrame" title="${escape(bundle.title)}" allow="fullscreen *; autoplay; gamepad" allowfullscreen></iframe><script type="module">
window.OFFLINE_CAR=${JSON.stringify(metadata)};
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),ungzip=async b=>new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()),text=b=>new TextDecoder().decode(b),module=s=>'data:text/javascript;base64,'+btoa(String.fromCharCode(...new TextEncoder().encode(s)));
try{
 let raw=bytes('${packed.toString('base64')}');
 ${codec==='br'?`const d=JSON.parse(text(await ungzip(bytes('${decoder}')))),m=await import(module(d.js));await m.default({module_or_path:bytes(d.wasm)});raw=m.decompress(raw);`:'raw=await ungzip(raw);'}
 const b=${format==='tables'?'('+decodeTables.toString()+')(raw)':'JSON.parse(text(raw))'};window.MUCS_GPS_CONTEXT=b.gps;window.MUCS_GPS_LOADING=Promise.resolve(b.gps);
 if(b.recipe){const m=await import(module(b.runtime+'\\nexport {installOfflineRecipes};'));window.TRACK2_CATALOG={data:b.data,catalog:b.catalog};window.TRACK2_UNPACK=window.TRACK2_READY=Promise.resolve(m.installOfflineRecipes(b));}
 // Explicit fullscreen delegation also covers opaque file:// + srcdoc origins.
 // Keep exact prepared simulator text available for integrity verification.
 window.OFFLINE_SIM_TEXT=b.html;
 await import(module(b.navigation));const frame=document.getElementById('simFrame');
 frame.onload=()=>{const began=performance.now(),wait=()=>{const app=frame.contentWindow[b.app];if(app?.updatePhysics&&(app.drawWorld||app.drawCity)){window.MUCSNavigation.install(frame.contentWindow,app,b.key);window.__offlineApp=app;document.getElementById('loading').remove();frame.contentWindow.focus();}else if(performance.now()-began<120000)setTimeout(wait,50);else document.getElementById('loading').textContent='Could not open this simulator. Please reload the file.';};wait();};frame.srcdoc=b.html;
}catch(error){document.getElementById('loading').textContent='Could not open this offline file: '+error.message;throw error;}
</script></body></html>`;
}
const requested=new Set(process.argv.slice(2)),jobs=[];
for(const [version,mapping]of[['1',files],['2',files2]])for(const [key,file]of Object.entries(mapping))if(!requested.size||requested.has(key))jobs.push({version,key,file});
// A targeted rebuild keeps the other car editions and their download entries.
const results=requested.size&&fs.existsSync(output+'/manifest.json')?json(output+'/manifest.json').filter(r=>!requested.has(r.key)):[];let next=0;
async function build({key,version,file}){
 const original=read(file),html=context.window.MUCSNavigation.prepare(context.window.MUCSDriving.prepare(original,key),key),routes=new Set([...snapshots[key].routes,...Array.from(html.matchAll(/data-circuit="([^"]+)"/g),m=>m[1])]);
 const bundle={key,version,title:file.replace(/\.html$/,''),app:original.match(/window\.(\w+App)\s*=/)[1],sourceSha256:sha(original),preparedSha256:sha(html),html,navigation,gps:{...gps,routes:select(gps.routes,routes)}};
 if(version==='2')Object.assign(bundle,{catalog:select(catalog.catalog,routes),data:select(catalog.data,routes),proof:Object.fromEntries(Object.entries(select(proof.routes,routes)).map(([n,p])=>[n,{...p,...corrections.routes[n]}])),recipe,runtime,museum:routes.has('Museo Ferrari, Maranello')?museum:[]});
 const originalBytes=Buffer.from(JSON.stringify(bundle)),candidates=[];
 for(const [format,raw]of [['json',originalBytes],['tables',encodeTables(bundle)]]){
  const digest=sha(raw),cached=path.join(cache,digest+'.br'),packed=fs.existsSync(cached)?fs.readFileSync(cached):await br(raw,{params:{[constants.BROTLI_PARAM_QUALITY]:11,[constants.BROTLI_PARAM_LGWIN]:24}});
  if(!brotliDecompressSync(packed).equals(raw))throw Error('Brotli changed simulator bytes: '+key);fs.writeFileSync(cached,packed);
  const gzip=gzipSync(raw,{level:9});if(!gunzipSync(gzip).equals(raw))throw Error('Gzip changed simulator bytes: '+key);
  candidates.push({format,codec:'br',html:page(bundle,packed,'br',format)},{format,codec:'gzip',html:page(bundle,gzip,'gzip',format)});
 }
 const pages=candidates.sort((a,b)=>Buffer.byteLength(a.html)-Buffer.byteLength(b.html)),chosen=pages[0];
 const dir=path.join(output,'Track '+version+'.0');fs.mkdirSync(dir,{recursive:true});const dest=path.join(dir,file);execFileSync(process.execPath,['--check','--input-type=module'],{input:chosen.html.split('<script type="module">')[1].split('</script>')[0],maxBuffer:20_000_000});fs.writeFileSync(dest,chosen.html);
 const record={key,version,file:dest,source:file,app:bundle.app,sourceSha256:bundle.sourceSha256,preparedSha256:bundle.preparedSha256,fileSha256:sha(chosen.html),bytes:Buffer.byteLength(chosen.html),uncompressedBytes:originalBytes.length,codec:chosen.codec,format:chosen.format,alternatives:pages.map(p=>({format:p.format,codec:p.codec,bytes:Buffer.byteLength(p.html)})),routes:[...routes],worlds:Object.keys(bundle.data||{})};results.push(record);console.log(key,version,record.codec,(record.bytes/1e6).toFixed(3)+' MB');
}
await Promise.all(Array.from({length:3},async()=>{while(next<jobs.length)await build(jobs[next++]);}));
results.sort((a,b)=>a.key.localeCompare(b.key)||a.version.localeCompare(b.version));
fs.writeFileSync(output+'/manifest.json',JSON.stringify(results,null,2)+'\n');
const links=results.map(r=>({name:r.source.replace(/\.html$/,''),path:r.file.slice(output.length+1),mb:(r.bytes/1e6).toFixed(2)}));
fs.writeFileSync(output+'/README.md','# Individual offline simulators\n\nDownload a car’s HTML file, then open that file in a current browser. Each download works by itself without a server, assets folder or internet connection. Track 1.0 and Track 2.0 are retained separately; the Phantom has its existing single edition.\n\nAll simulator source, controls, maps, artwork, audio synthesis and route geometry are retained. The builder selects the smaller complete file from maximum-level Brotli and gzip, including decoder overhead. Large coordinate tables also use exact integer deltas where every original value is reproduced exactly. No image downsampling, geometry simplification or reduced-quality settings are used. Track 2.0 worlds are reconstructed in a worker and checked against the original vertex and batch SHA-256 hashes before driving.\n\n'+links.map(l=>'- ['+l.name+']('+encodeURI(l.path)+') — '+l.mb+' MB').join('\n')+'\n\nBuilt with `node tools/offline/individual.mjs`. Brotli decoding uses the repository’s vendored MIT-licensed brotli-dec-wasm.\n');
fs.writeFileSync(output+'/index.html','<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Individual offline simulators</title><style>body{max-width:900px;margin:40px auto;padding:0 20px;background:#101b25;color:#e9f5fc;font:16px/1.6 system-ui}a{color:#73d9ff}li{margin:8px 0}</style><h1>Individual offline simulators</h1><p>Download one HTML file and open it anywhere, without an internet connection. Both track editions keep the full simulator quality.</p><p><a href="../">Back to the garage</a></p><ul>'+links.map(l=>'<li><a download href="'+escape(encodeURI(l.path))+'">'+escape(l.name)+'</a> · '+l.mb+' MB</li>').join('')+'</ul></html>');
console.log('Complete:',results.length,'files;',results.reduce((n,r)=>n+r.bytes,0)/1e6,'MB; largest',Math.max(...results.map(r=>r.bytes))/1e6,'MB.');
