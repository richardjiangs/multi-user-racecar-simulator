import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {pathToFileURL} from 'node:url';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const errors=[],results=[],page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));
page.setDefaultTimeout(15000);
const url=process.env.GPS_URL||'http://127.0.0.1:8000/';await page.goto(url);await page.waitForFunction(()=>window.__mucs&&window.MUCSNavigation);
const all=JSON.parse(fs.readFileSync('tools/tracks2/sim-files.json'));
async function load(key,version='2'){
 await page.selectOption('#trackVersion',version);await page.evaluate(k=>__mucs.openPractice(k),key);
 await page.waitForFunction(k=>{const a=__mucs.getSimApp();return a&&(a.drawWorld||a.drawCity)&&document.querySelector('#simFrame').contentDocument.documentElement.dataset.controls&&(!MUCSNavigation.eligible(k)||a.gps);},key,{timeout:60000});
 return page.frames().find(f=>f!==page.mainFrame());
}
async function run(fn,arg){return page.evaluate(({src,arg})=>{const a=__mucs.getSimApp();return (0,eval)('('+src+')')(a,arg);},{src:fn.toString(),arg});}
async function back(){await page.evaluate(()=>__mucs.backToGarage());}
try{
 // Cover every eligible renderer and every exclusion, on both track engines.
 if(!process.env.GPS_QUICK)for(const version of ['1','2'])for(const key of Object.keys(all)){
  const f=await load(key,version),enabled=await page.evaluate(k=>MUCSNavigation.eligible(k),key);
  if(enabled){
   await run((a)=>{a.setView('drive');a.state.started=true;a.gps.setMode('dashboard');a.gps.render(performance.now()+100);});
   let info=await run(a=>a.gps.inspect());assert.equal(info.mode,'dashboard',key);assert.ok(Number.isFinite(info.player.worldX+info.player.worldZ),key);
   await run(a=>{a.gps.setMode('mirror');(a.drawWorld||a.drawCity)();a.gps.setMode('ar');(a.drawWorld||a.drawCity)();});
   assert.ok(await f.locator('#gpsMode').isVisible(),key);assert.equal(await f.locator('#gpsMode option').count(),4);
  }else assert.equal(await f.locator('#gpsUnit').count(),0,key);
  results.push({key,version,enabled});console.log(version,key,enabled);await back();
 }
 console.log('Interaction checks');const f=await load('bugatti');await f.locator('#startBtn').click();await page.waitForTimeout(400);await run(async a=>{a.selectCircuit('Circuit de Monaco');await a.prepareTrack('Circuit de Monaco');a.setView('drive');a.state.started=true;a.state.assist=false;a.state.testDriver=false;a.state.speedMps=0;a.state.distanceM=1250;a.state.laneOffset=2;a.state.headingRel=0;a.resetContacts?.();a.state.rivals=[{name:'GPS test car',distM:1270,lane:-2,body:'#eb6812',speedMps:0,topMps:0,latG:1,accel:0}];a.state.traffic=[];a.state.raceGrid=true;a.gps.setMode('dashboard');a.gps.setPreset(2);a.gps.render(performance.now()+1000);});
 let positions=await run(a=>{const i=a.gps.inspect(),p=a.worldPose(),r=a.trackLateral(a.trackAt(a.state.rivals[0].distM),a.state.rivals[0].lane);return {i,p,r};});
 assert.ok(Math.hypot(positions.i.player.worldX-positions.p.x,positions.i.player.worldZ-positions.p.z)<.001);
 assert.ok(Math.hypot(positions.i.markers[0].worldX-positions.r.x,positions.i.markers[0].worldZ-positions.r.z)<.1);
 assert.ok(positions.i.scalePixelsPerM*positions.i.roadHalfWidth*2>10);
 console.log('Map click');await f.locator('#gpsViewport').click();await page.waitForTimeout(100);assert.equal(await run(a=>a.gps.preset),1);
 // A key released after focusing navigation must still release the driving input.
 await run(a=>{a.state.keys.KeyW=true;});await f.locator('#gpsViewport').focus();await page.keyboard.up('w');assert.equal(await run(a=>a.state.keys.KeyW),false);
 const gesture=await f.evaluate(()=>{const a=BugattiApp;a.state.trackpadSteering=true;a.state.touchSteer=.2;document.getElementById('gpsViewport').dispatchEvent(new WheelEvent('wheel',{deltaX:120,deltaY:-80,bubbles:true,cancelable:true}));const steer=a.state.touchSteer;a.state.trackpadSteering=false;a.gps.setPreset(1);return steer;});assert.equal(gesture,.2);

 console.log('Zoom button');await f.locator('#gpsZoomIn').click();await page.waitForTimeout(150);assert.ok((await run(a=>a.gps.inspect())).zoom>1);
 console.log('Map click');await f.locator('#gpsViewport').click();await page.waitForTimeout(100);assert.equal(await run(a=>a.gps.preset),2);
 console.log('Zoom button');await f.locator('#gpsZoomOut').click();await page.waitForTimeout(100);assert.ok((await run(a=>a.gps.inspect())).zoom<1);
 await run(a=>{const p=a.pitModel();a.state.inPitLane=true;a.state.pitQ=(p.boxStart+p.boxEnd)/2;a.state.laneOffset=2;a.state.rivals[0].pitState='box';a.state.rivals[0].pitQ=p.boxStart;a.state.rivals[0].pitT=100;a.gps.render(performance.now()+1000);});
 const pit=await run(a=>({i:a.gps.inspect(),p:a.worldPose(),r:a.pitSurface(a.state.rivals[0].pitQ,a.state.rivals[0].lane)}));assert.ok(Math.hypot(pit.i.player.worldX-pit.p.x,pit.i.player.worldZ-pit.p.z)<.001);assert.ok(Math.hypot(pit.i.markers[0].worldX-pit.r.x,pit.i.markers[0].worldZ-pit.r.z)<.1);
 await run(a=>{a.state.inPitLane=false;a.gps.setMode('ar');(a.drawWorld||a.drawCity)();});assert.ok((await run(a=>a.gps.inspect())).arChevrons>0);
 for(const viewport of [{width:1440,height:900},{width:900,height:500},{width:430,height:900}]){
  await page.setViewportSize(viewport);for(const mode of ['dashboard','mirror','ar']){await f.selectOption('#gpsMode',mode);await page.waitForTimeout(100);const box=await f.locator('#gpsUnit').boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=viewport.width+1&&box.y+box.height<=viewport.height+1,JSON.stringify({viewport,box}));}
 }
 await run(a=>a.gps.setMode('off'));assert.ok(!await f.locator('#gpsUnit').isVisible());await run(a=>{a.gps.setMode('dashboard');a.setView('exterior');});assert.ok(!await f.locator('#gpsUnit').isVisible());await back();
 console.log('Phantom network');await page.setViewportSize({width:1440,height:900});await load('phantom');await run(a=>{a.enterLondon();a.setView('drive');a.gps.setMode('dashboard');a.gps.setPreset(2);a.drawCity();});assert.equal((await run(a=>a.gps.inspect())).route,'London road network');
 assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync(process.env.GPS_QUICK?'tests/gps/interaction-results.json':'tests/gps/results.json',JSON.stringify({checked:results.length,eligible:results.filter(r=>r.enabled).length,allFourModes:true,laneCoordinates:true,pitCoordinates:true,clickAndZoom:true,responsive:true,phantomNetwork:true,errors},null,2));console.log('PASS',results.length,'car/version combinations, positions, modes, zoom, responsive, Phantom network');
}finally{await browser.close();}
