import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch();
const garage=process.argv.includes('--garage'),base=process.env.TEST_BASE_URL||'http://127.0.0.1:8000/';
try{for(const edition of['',' 2.0']){
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));let frame;
 if(garage){await page.goto(base);await page.waitForFunction(()=>window.__mucs);await page.selectOption('#trackVersion',edition?'2':'1');await page.evaluate(()=>__mucs.openPractice('roadster2'));await page.waitForFunction(()=>__mucs.getSimApp()?.roadsterReadInputs);frame=await (await page.$('#simFrame')).contentFrame();}
 else{await page.goto(base+encodeURIComponent('Tesla Roadster 2 simulator'+edition+'.html'));frame=page.mainFrame();}
 await frame.click('#startBtn');
 const step=sec=>frame.evaluate(sec=>{const a=RoadsterApp;for(let i=0;i<sec*120;i++){a.state.time+=1/120;a.updatePhysics(1/120);}},sec);
 const read=()=>frame.evaluate(()=>({...RoadsterApp.state.roadster}));
 const reports=[];
 for(const circuit of edition?['JFK Airport — Runway 13R/31L','Circuit de Monaco']:['JFK Airport — Runway 13R/31L']){
  await frame.evaluate(async circuit=>{const a=RoadsterApp;a.selectCircuit(circuit);await a.prepareTrack?.(circuit);a.roadsterAction('drive');a.toggleRocket();},circuit);
  await frame.click('#worldCanvas',{position:{x:700,y:250}});await page.keyboard.down('p');await step(3);await page.keyboard.up('p');await page.keyboard.press('f');await step(10);
  for(const key of['d','a']){
   const start=await read();await page.keyboard.down(key);await step(10);await page.keyboard.up(key);const full=await read();
   const sign=key==='d'?-1:1;assert.ok((full.roll-start.roll)*sign>2*Math.PI,'A/D must cross 360°, not stop at a bank angle');
   assert.ok(Math.hypot(full.x-start.x,full.z-start.z)<.05,'Roll must not translate a held car');assert.ok(Math.abs(full.yaw-start.yaw)<.001,'Roll must not turn its nose');
   await step(2);const held=await read();assert.equal(held.yoke,full.yoke);assert.ok((held.roll-full.roll)*sign>1.5,'Released A/D retains the yoke setting and continues rolling');
   // Both controls work together: I/O turn in place without overwriting A/D roll.
   await page.keyboard.down('i');await step(.8);await page.keyboard.up('i');const combined=await read();assert.ok((combined.roll-held.roll)*sign>.5);const yawDelta=Math.atan2(Math.sin(combined.yaw-held.yaw),Math.cos(combined.yaw-held.yaw));assert.ok(yawDelta<-.8);assert.ok(Math.hypot(combined.x-start.x,combined.z-start.z)<.05);
   await page.keyboard.press('f');await step(12);const level=await read();assert.ok(Math.abs(level.roll)<.002&&Math.abs(level.rollRate)<.01&&level.yoke===0,'F levels and arrests roll');assert.equal(level.positionHold,true);
   reports.push({circuit,key,degrees:(full.roll-start.roll)*180/Math.PI,drift:Math.hypot(full.x-start.x,full.z-start.z)});
  }
  await frame.evaluate(()=>{RoadsterApp.drawWorld();RoadsterApp.updateUi();});
 }
 assert.deepEqual(errors,[]);console.log('PASS '+(garage?'garage ':'')+'Roadster '+(edition||'1.0')+': keyboard continuous A/D rolls, retained lever, no drift or heading change, independent I/O, F leveling',JSON.stringify(reports));await page.close();
}}finally{await browser.close();}
