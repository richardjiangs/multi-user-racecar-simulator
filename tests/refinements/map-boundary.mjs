import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],results=[];page.on('pageerror',e=>errors.push(e.stack));
const run=(fn,arg)=>page.evaluate(({fn,arg})=>(0,eval)('('+fn+')')(__mucs.getSimApp(),arg),{fn:String(fn),arg});
async function load(key,version){await page.selectOption('#trackVersion',version);await page.evaluate(k=>__mucs.openPractice(k),key);await page.waitForFunction(()=>__mucs.getSimApp()?.gps,null,{timeout:60000});const f=page.frames().find(f=>f!==page.mainFrame());await f.locator('#startBtn').click();await page.waitForTimeout(300);return f;}
try{
 await page.goto('http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);
 for(const version of ['1','2']){
  await load('db5',version);await run(async a=>{const n=Object.keys(a.CIRCUITS).find(n=>/Furka/.test(n));a.selectCircuit(n);await a.prepareTrack?.(n);});
  const checks=await run(a=>{const s=a.state,rows=[];for(const real of [false,true])for(const side of [-1,1])for(const distance of [400,1250,2100]){
   a.resetContacts?.();Object.assign(s,{realMode:real,started:true,ignition:true,gearMode:'G',curGear:3,raceGrid:false,rivals:[],speedMps:20,distanceM:distance,laneOffset:side*(a.halfWidthAt(distance)-.9),headingRel:side*.45,assist:false,testDriver:false,throttle:0,brake:0});s.keys={};let maxYaw=0,maxStep=0,oldYaw=s.headingRel,oldD=s.distanceM;
   for(let i=0;i<600;i++){a.updatePhysics(1/120);maxYaw=Math.max(maxYaw,Math.abs(Math.atan2(Math.sin(s.headingRel-oldYaw),Math.cos(s.headingRel-oldYaw))));maxStep=Math.max(maxStep,Math.abs(s.distanceM-oldD));oldYaw=s.headingRel;oldD=s.distanceM;if(!Number.isFinite(s.speedMps+s.distanceM+s.headingRel+s.laneOffset))throw Error('Nonfinite boundary');}
   rows.push({real,side,distance,maxYaw,maxStep,lane:s.laneOffset,limit:a.halfWidthAt(s.distanceM),events:a.contactInfo?.().events.length||0,sparks:a.contactInfo?.().sparks.total||0});}return rows;});
  for(const c of checks){assert.ok(c.maxYaw<.06,JSON.stringify(c));assert.ok(c.maxStep<1,JSON.stringify(c));assert.ok(Math.abs(c.lane)<c.limit-.8,JSON.stringify(c));assert.equal(c.events,0);assert.equal(c.sparks,0);}results.push({version,boundaries:checks});await page.evaluate(()=>__mucs.backToGarage());
 }
 for(const key of ['f1mercedes','db5','bugatti']){
  const f=await load(key,'2');await run(async a=>{a.selectCircuit('Circuit de Monaco');await a.prepareTrack('Circuit de Monaco');a.setView('drive');Object.assign(a.state,{speedMps:0,distanceM:1307,laneOffset:0,headingRel:0,started:false});a.gps.setMode('line');a.gps.setPreset(2);a.gps.render(performance.now()+100);});await page.waitForTimeout(250);
  const info=await run(a=>a.gps.inspect());assert.ok(info.apexLabels.some(c=>c.number===6),JSON.stringify(info.apexLabels));
  const tx=250+['f1mercedes','db5','bugatti'].indexOf(key)*100,ty=240;const map=f.locator('#gpsViewport'),box=await map.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(tx,ty,{steps:10});await page.mouse.up();await page.waitForTimeout(200);
  const after=await map.boundingBox();assert.ok(Math.abs(after.x+after.width/2-tx)<5,JSON.stringify(after));assert.ok(Math.abs(after.y+after.height/2-ty)<5);assert.equal(await run(a=>a.gps.preset),2);assert.equal(await f.locator('#gpsUnit button:visible').count(),0);
  await page.mouse.wheel(0,-150);await page.waitForTimeout(200);assert.ok((await run(a=>a.gps.inspect())).zoom>1);
  await page.screenshot({path:'/tmp/'+key+'-movable-map.png'});results.push({key,apex:6,dragged:true,zoomed:true});await page.evaluate(()=>__mucs.backToGarage());
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('tests/refinements/map-boundary-results.json',JSON.stringify({results,errors},null,2));console.log('PASS DB5 continuous boundary, draggable map, zoom and Fairmont apex number');
}finally{await browser.close();}
