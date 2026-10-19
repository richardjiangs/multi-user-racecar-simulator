import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath()}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);
 for(const version of ['1','2'])for(const key of ['tesla','supra']){
  await page.selectOption('#trackVersion',version);await page.evaluate(k=>__mucs.openPractice(k),key);await page.waitForFunction(()=>__mucs.getSimApp()?.gps);const frame=page.frames().find(f=>f!==page.mainFrame());await frame.evaluate(()=>window.requestAnimationFrame=()=>0);await page.waitForTimeout(50);
  await frame.locator('#startBtn').click();const originalPage=await browser.newPage();const filename=key==='tesla'?'Tesla Model S Plaid simulator.html':'Toyota Supra MK4 simulator.html';await originalPage.goto('http://127.0.0.1:8000/'+encodeURIComponent(filename));
  const original=await originalPage.evaluate(()=>{const a=Object.values(window).find(v=>v&&v.SPEC&&v.updatePhysics&&v.drawWorld);Object.assign(a.state,{steer:0,speedMps:0,rpm:0,time:0,ignition:false,curGear:1,gearMode:'N'});a.updateUi();return{spec:JSON.stringify(a.SPEC),physics:a.engineTorque.toString(),cabin:a.el.cabinArt.innerHTML,engine:a.el.engineBay.innerHTML};});
  const current=await page.evaluate(()=>{const a=__mucs.getSimApp();Object.assign(a.state,{steer:0,speedMps:0,rpm:0,time:0,ignition:false,curGear:1,gearMode:'N'});a.updateUi();return{spec:JSON.stringify(a.SPEC),physics:a.engineTorque.toString(),cabin:a.el.cabinArt.innerHTML,engine:a.el.engineBay.innerHTML};});
  assert.equal(current.spec,original.spec,key+' performance specification');assert.equal(current.physics,original.physics,key+' engine torque');
  if(key==='tesla'){assert.equal(current.cabin,original.cabin,'Tesla cabin unchanged');assert.equal(current.engine,original.engine,'Tesla engine unchanged');}await originalPage.close();
  const wheels=await page.evaluate(()=>{const a=__mucs.getSimApp();a.setView('exterior');a.state.wheelRotation=24;a.updateUi();return [...a.el.exteriorArt.querySelectorAll('.wSpin')].map(el=>el.ownerDocument.defaultView.getComputedStyle(el).transform);});assert.equal(wheels.length,2);assert.ok(wheels.every(t=>t!=='none'&&t!=='matrix(1, 0, 0, 1, 0, 0)'),key+' '+version+' '+JSON.stringify(wheels));
  await page.evaluate(()=>__mucs.getSimApp().setView('exterior'));await frame.locator('[data-door="driver"]').click();assert.ok(await frame.locator('#doorArt').evaluate(e=>e.classList.contains('open')));await frame.locator('[data-door="driver"]').click();
  if(key==='supra'){
   assert.deepEqual(await frame.locator('#gpsMode option').evaluateAll(es=>es.map(e=>e.value).sort()),['ar','dashboard','line','mirror','off']);
   for(const mode of ['off','dashboard','mirror','ar','line']){await page.evaluate(mode=>{const a=__mucs.getSimApp();a.gps.setMode(mode);a.setView('drive');a.gps.render(performance.now()+1000);},mode);assert.equal(await page.evaluate(()=>__mucs.getSimApp().gps.inspect().mode),mode);}
   await page.evaluate(()=>__mucs.getSimApp().setView('cockpit'));
   const live=await page.evaluate(()=>{const a=__mucs.getSimApp(),c=a.el.cabinArt.querySelector('canvas');Object.assign(a.state,{speedMps:0,rpm:900,steer:0});a.updateUi();const before=c.toDataURL();Object.assign(a.state,{speedMps:50,rpm:5500,steer:.5});a.updateUi();return before!==c.toDataURL();});assert.ok(live,'Supra live instruments and steering');
   await frame.getByRole('button',{name:'Supra cockpit Ignition',exact:true}).click();const ignition=await page.evaluate(()=>__mucs.getSimApp().state.ignition);await frame.getByRole('button',{name:'Supra cockpit Ignition',exact:true}).click();assert.notEqual(await page.evaluate(()=>__mucs.getSimApp().state.ignition),ignition);
   for(const size of [{width:1440,height:900},{width:844,height:390},{width:390,height:844}]){await page.setViewportSize(size);await page.evaluate(()=>{const a=__mucs.getSimApp();a.setView('drive');a.drawWorld();});const layout=await page.evaluate(()=>({top:__mucs.getSimApp().supraDashboard.topY,h:document.getElementById('simFrame').contentWindow.innerHeight}));assert.ok(layout.top>=layout.h*.68,'Clear forward view '+JSON.stringify(size));}
   await page.setViewportSize({width:1440,height:900});
  }
  await page.evaluate(()=>{const a=__mucs.getSimApp();a.state.speedMps=0;a.state.steer=0;a.setView('exterior');a.updateUi();a.drawWorld();});await page.screenshot({path:'/tmp/review-'+key+'-'+version+'-exterior.png'});
  if(key==='supra')for(const view of ['cockpit','engine','drive']){await page.evaluate(v=>{const a=__mucs.getSimApp();a.setView(v);a.updateUi();a.drawWorld();},view);await page.waitForTimeout(100);await page.screenshot({path:'/tmp/review-supra-'+version+'-'+view+'.png'});}
  checks.push({key,version});await page.evaluate(()=>__mucs.backToGarage());
 }
 assert.deepEqual(errors,[]);console.log('PASS Tesla exterior-only preservation; Supra artwork, live gauges, controls, five map modes and three viewport sightlines:',checks);
}finally{await browser.close();}
