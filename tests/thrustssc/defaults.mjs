import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';import{routeFor}from'../../tools/driving/defaults.mjs';import{silenceOutput}from'./mute.mjs';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json'),{chromium}=require('playwright');
const maps=[JSON.parse(fs.readFileSync('tools/tracks2/sim-files.json')),JSON.parse(fs.readFileSync('tools/tracks2/manifest.json'))],jobs=maps.flatMap((m,i)=>Object.entries(m).map(([key,file])=>({key,file,version:i+1}))),results=[];let next=0;
const selected=process.env.DEFAULT_VERSION?jobs.filter(j=>String(j.version)===process.env.DEFAULT_VERSION):jobs;
const browser=await chromium.launch({headless:true,args:['--mute-audio']});
try{await Promise.all(Array.from({length:1},async()=>{while(next<selected.length){const job=selected[next++],context=await browser.newContext({viewport:{width:1280,height:800}});await context.addInitScript(silenceOutput);await context.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs,null,{polling:50});await page.selectOption('#trackVersion',String(job.version));await page.evaluate(k=>__mucs.openPractice(k),job.key);
  await page.waitForFunction(()=>__mucs.getSimApp()?.startingDefaultsApplied&&__mucs.getSimApp()?.gps,null,{timeout:120000,polling:50});
  const frame=page.frameLocator('#simFrame');const start=frame.locator('#startBtn');if(await start.count())await start.click({timeout:60000,force:true});await page.waitForTimeout(150);await page.evaluate(async()=>{const a=__mucs.getSimApp();if(a.trackModel?.())await a.prepareTrack?.(a.state.route.name);a.updatePhysics(1/120);});
  const state=await page.evaluate(()=>{const a=__mucs.getSimApp(),w=document.getElementById('simFrame').contentWindow;return {defaults:a.startingDefaultsApplied,route:a.state.route.name,london:!!a.state.ldn,destination:a.cityNetwork?.destinationPoint?.name||null,assist:a.state.assist,testDriver:a.state.testDriver,muted:w.__testsMuted,finite:Number.isFinite(a.state.speedMps),ready:!a.trackModel?.()||a.trackMeshReady?.()};});
  assert.equal(state.defaults.key,job.key);assert.equal(state.assist,false);assert.equal(state.testDriver,false);assert(state.muted&&state.finite);
  if(routeFor(job.key)==='London'){assert(state.london);assert.equal(state.destination,null);}else assert.equal(state.route,routeFor(job.key));
  assert.deepEqual(errors,[]);results.push({...job,...state});console.log('PASS',job.key,job.version,state.route);
 }catch(e){console.error('FAIL',job,e.stack,errors);throw e;}finally{await context.close();}
}}));fs.writeFileSync('tests/thrustssc/default-results.json',JSON.stringify(results,null,2));console.log('PASS ALL',results.length,'editions, outputs muted.');}finally{await browser.close();}
