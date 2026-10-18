import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {pathToFileURL} from 'node:url';
import {LITE_KEYS} from '../../tools/offline/build.mjs';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'}),results=[];
try{
 for(const file of ['index-offline.html','index-offline LITE.html']){
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>{if(/^https?:/.test(r.request().url())){requests.push(r.request().url());return r.abort();}return r.continue();});
  await page.goto(pathToFileURL(process.cwd()+'/'+file).href,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.__mucs&&window.MUCS_GPS_CONTEXT&&window.TRACK2_CATALOG,null,{timeout:60000});
  const keys=await page.locator('[data-car-card]').evaluateAll(es=>es.map(e=>e.dataset.carCard)),lite=file.includes('LITE');assert.equal(keys.length,lite?10:64);if(lite)assert.deepEqual(keys.slice().sort(),LITE_KEYS.slice().sort());
  const images=await page.locator('.offline-exterior').evaluateAll(async es=>{for(const e of es){e.loading='eager';await e.decode();}return es.map(e=>({width:e.naturalWidth,src:e.src.slice(0,26)}));});assert.equal(images.length,keys.length);assert.ok(images.every(i=>i.width>0&&i.src.startsWith('data:image/svg+xml;base64,')));
  const encoded=await page.evaluate(()=>Object.keys(window.EMBEDDED_SIM_GZIP_BASE64));assert.equal(encoded.length,lite?20:127);assert.ok(encoded.every(k=>keys.includes(k.split('@')[0])));
  await page.screenshot({path:'/tmp/'+(lite?'lite':'full')+'-offline-garage.png'});
  for(const version of (lite?['1','2']:['2']))for(const key of (lite?LITE_KEYS:['supra','tesla','phantom'])){
   await page.selectOption('#trackVersion',version);await page.evaluate(k=>__mucs.openPractice(k),key);await page.waitForFunction(()=>__mucs.getSimApp()?.gps,null,{timeout:60000});
   const route=key==='dacia'?'Prologue — Yanbu':key==='db5'?'Furka Pass':key==='spectre'||key==='phantom'?'London':key==='supra'?'Fuji Speedway':'Circuit de Monaco';
   const info=await page.evaluate(async({route,key,version})=>{const a=__mucs.getSimApp();if(key!=='phantom'){a.selectCircuit(route);if(version==='2'&&route!=='London')await a.prepareTrack?.(route);}a.setView('drive');a.gps.setMode('line');a.gps.render(performance.now()+1000);return a.gps.inspect();},{route,key,version});assert.ok(Number.isFinite(info.player.worldX+info.player.worldZ));
   if(version==='2'&&route!=='London')assert.ok(await page.evaluate(async name=>{const t=await window.TRACK2_READY;const m=await t.ensure(name);return m.vertices>0&&m.bytes.length===m.vertices*16;},route),'Complete track mesh '+route);
   if(key==='supra')for(const mode of ['off','mirror','ar','dashboard','line']){assert.equal(await page.evaluate(mode=>{const a=__mucs.getSimApp();a.gps.setMode(mode);a.gps.render(performance.now()+1000);return a.gps.inspect().mode;},mode),mode);}
   results.push({file,key,version,route:info.route});await page.evaluate(()=>__mucs.backToGarage());
  }
  // Loading the largest kind of stage exercises the embedded WASM decoder too.
  if(lite){const stage='Stage 8 — Wadi Ad Dawasir';assert.ok(await page.evaluate(async n=>{const m=await (await TRACK2_READY).ensure(n);return m.vertices>100000;},stage));}
  assert.deepEqual(errors,[]);assert.ok(!requests.some(u=>/simulator|tracks-2|gps\/context|vendor\//.test(u)),requests.join('\n'));await page.close();
 }
 fs.writeFileSync('tests/refinements/offline-editions-results.json',JSON.stringify({checks:results,networkRequired:false,fullBytes:fs.statSync('index-offline.html').size,liteBytes:fs.statSync('index-offline LITE.html').size},null,2));console.log('PASS offline full/LITE:',results.length,'car/version launches, all SVG cards, full track geometry, Supra maps, no required network.');
}finally{await browser.close();}
