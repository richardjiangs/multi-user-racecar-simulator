import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..'),out=process.env.VERIFICATION_DIR;
const cars={venom:['Hennessey Venom F5','VenomApp'],amgone:['Mercedes-AMG One','AmgOneApp'],aston:['Aston Martin Valkyrie','AstonApp'],mcf1:['McLaren F1 1993','McF1App']};
const baseline='f353437';
function block(src,a,b){const start=src.indexOf(a),end=src.indexOf(b,start);assert(start>=0&&end>start,a);return src.slice(start,end);}
for(const [name] of Object.values(cars)){
 const file=name+' simulator.html',before=execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8',maxBuffer:3e6}),after=readFileSync(resolve(root,file),'utf8');
 // Calibrated SPEC, audio graph, physics and transmission routines are unchanged.
 for(const [start,end] of [['const SPEC =','/* ===== shared context'],['/* ===== audio:','/* ===== physics:'],['/* ===== physics:','/* ===== render:']])
   assert.equal(block(after,start,end),block(before,start,end),name+' preserves '+start);
}
const sources=Object.values(cars).map(([name])=>resolve(root,name+' simulator.html'));
const beforeRefresh=sources.map(f=>readFileSync(f,'utf8'));
execFileSync(process.execPath,[resolve(root,'tools/refresh-next-hypercars-art.mjs')],{cwd:root});
sources.forEach((f,i)=>assert.equal(readFileSync(f,'utf8'),beforeRefresh[i],f+' refresh idempotent'));
if(out)mkdirSync(out,{recursive:true});
const {chromium}=await import(process.env.CODEX_NODE_MODULES?pathToFileURL(resolve(process.env.CODEX_NODE_MODULES,'playwright/index.mjs')).href:'playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined}),errors=[];
try{
 for(const [key,[name,appName]] of Object.entries(cars)){
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.setDefaultTimeout(8000);
  page.on('pageerror',e=>errors.push(name+': '+e.message));
  page.on('console',msg=>{if(msg.type()==='error'&&/attribute|Path|SVG/.test(msg.text()))errors.push(name+': '+msg.text());});
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto(pathToFileURL(resolve(root,name+' simulator.html')).href);
  await page.waitForFunction(n=>!!window[n]?.updateUi,appName);
  await page.evaluate(n=>{const a=window[n];a.el.keyOverlay.style.display='none';a.state.toastTimer=0;a.el.toast.classList.remove('show');a.resizeCanvas();a.setView('cockpit');a.drawWorld();a.updateUi();},appName);
  assert.equal(await page.evaluate(n=>window[n].state.ambient,appName),false,'cabin light starts off');
  const missing=await page.locator('#cabinArt [data-control]').evaluateAll(ns=>ns.filter(n=>!document.getElementById(n.dataset.control)).map(n=>n.dataset.control));assert.deepEqual(missing,[]);
  const duplicateIds=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return [...new Set(ids.filter((v,i)=>ids.indexOf(v)!==i))];});assert.deepEqual(duplicateIds,[],'unique SVG ids');
  // Use the drawn control, not its underlying button, for state transitions.
  for(const [control,field] of [['lightsBtn','lights'],['coolBtn','cool'],['startSwitchBtn','ignition']]){
   const button=page.locator('#cabinArt [data-control="'+control+'"]').first();const old=await page.evaluate(({n,f})=>window[n].state[f],{n:appName,f:field});
   await button.click();assert.equal(await page.evaluate(({n,f})=>window[n].state[f],{n:appName,f:field}),!old,name+' '+control);
   await button.focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(({n,f})=>window[n].state[f],{n:appName,f:field}),old,'keyboard parity');
  }
  await page.locator('#cabinArt [data-control="upPaddle"]').first().click();assert.equal(await page.evaluate(n=>window[n].state.gearMode,appName),'G');
  await page.locator('#cabinArt [data-cabin-action="neutral"]').first().click();assert.equal(await page.evaluate(n=>window[n].state.gearMode,appName),'N');
  await page.locator('#cabinArt [data-control="hornBtn"]').click();assert.equal(await page.evaluate(n=>window[n].state.horn,appName),true);await page.waitForTimeout(210);assert.equal(await page.evaluate(n=>window[n].state.horn,appName),false);
  await page.evaluate(n=>{const a=window[n];a.state.speedMps=123/3.6;a.state.rpm=6000;a.state.gearMode='G';a.state.curGear=4;a.state.steer=.25;a.updateUi();a.drawWorld();},appName);
  assert.equal(await page.locator('#cabSpeedArt').textContent(),'123');assert.equal(await page.locator('#cabGearArt').textContent(),'4');assert.equal(await page.locator('#cabRpmArt').textContent(),'6000');
  const variant={venom:['fuelBtn','e85'],amgone:['drsBtn','drs'],mcf1:['raceAeroBtn','raceAero']}[key];
  if(variant){const [id,field]=variant;const old=await page.evaluate(({n,f})=>window[n].state[f],{n:appName,f:field});await page.locator('#cabinArt [data-control="'+id+'"]').first().click();assert.equal(await page.evaluate(({n,f})=>window[n].state[f],{n:appName,f:field}),!old);await page.locator('#cabinArt [data-control="'+id+'"]').first().click();}
  if(key==='aston'){
   await page.evaluate(()=>{AstonApp.state.speedMps=0;});await page.locator('#amrProArt').click();assert.equal(await page.evaluate(()=>AstonApp.state.amrPro),true);
   assert.equal(await page.locator('#exteriorArt .amr-variant-art').evaluate(e=>getComputedStyle(e).display),'inline');
   assert.equal(await page.locator('#engineBay .road-variant-art').evaluate(e=>getComputedStyle(e).display),'none');
   await page.keyboard.press('y');assert.equal(await page.evaluate(()=>AstonApp.state.amrPro),false);
  }
  if(key==='aston'||key==='mcf1'){
   await page.evaluate(n=>{const a=window[n];a.state.rivals=[];a.state.time=12;a.state.headingRel=0;a.drawWorld();},appName);
   const emptyViews=await page.evaluate(n=>window[n].rearViews,appName);assert.equal(emptyViews.length,2,'rear cameras always draw without traffic');assert.notEqual(emptyViews[0].eye,emptyViews[1].eye);assert.notEqual(emptyViews[0].yaw,emptyViews[1].yaw);
   const left=await page.locator('#rhRearLeft').evaluate(c=>c.toDataURL());const right=await page.locator('#rhRearRight').evaluate(c=>c.toDataURL());assert.notEqual(left,right,'independent rear projections');
   await page.evaluate(n=>{window[n].state.headingRel=.22;window[n].drawWorld();},appName);assert.notEqual(await page.locator('#rhRearLeft').evaluate(c=>c.toDataURL()),left,'live rear camera responds to heading');
   await page.evaluate(n=>{window[n].state.headingRel=0;},appName);
  }
  await page.evaluate(n=>{const a=window[n];a.state.speedMps=0;a.state.rpm=a.SPEC.idleRpm;a.state.gearMode='N';a.state.steer=0;a.state.time=12;a.state.toastTimer=0;a.el.toast.classList.remove('show');a.updateUi();a.drawWorld();},appName);
  if(out){await page.locator('#cabinArt').screenshot({path:resolve(out,key+'-cabin.png')});await page.screenshot({path:resolve(out,key+'-desktop-cockpit.png')});}
  await page.evaluate(n=>{const a=window[n];a.setView('exterior');a.updateUi();},appName);
  const rot=await page.locator('#exteriorArt .wSpin').first().evaluate(e=>getComputedStyle(e).transform);
  await page.evaluate(n=>{const a=window[n];a.state.speedMps=15;a.updatePhysics(1/60);a.updateUi();a.state.speedMps=0;},appName);
  assert.notEqual(await page.locator('#exteriorArt .wSpin').first().evaluate(e=>getComputedStyle(e).transform),rot);
  if(out)await page.locator('#exteriorArt').screenshot({path:resolve(out,key+'-exterior.png')});
  await page.evaluate(n=>{window[n].toggleDoor('driver');window[n].updateUi();},appName);await page.waitForTimeout(850);
  if(out)await page.locator('#exteriorArt').screenshot({path:resolve(out,key+'-door.png')});
  await page.evaluate(n=>{const a=window[n];a.closeAllDoors(true);a.setView('engine');a.updateUi();},appName);
  if(out)await page.locator('#engineBay').screenshot({path:resolve(out,key+'-engine-closed.png')});
  await page.locator('#coverBtn').click();await page.evaluate(n=>window[n].updateUi(),appName);await page.waitForTimeout(650);
  assert.equal(await page.locator('#engineBay .rhHatch').evaluate(e=>getComputedStyle(e).opacity),'0');
  if(out)await page.locator('#engineBay').screenshot({path:resolve(out,key+'-engine.png')});
  await page.evaluate(n=>{window[n].setView('drive');window[n].el.toast.classList.remove('show');window[n].drawWorld();},appName);
  if(out)await page.screenshot({path:resolve(out,key+'-drive.png')});
  // Resize dispatch clears the canvas. Wait for that event before drawing a frozen frame.
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);await page.evaluate(n=>{window[n].resizeCanvas();window[n].drawWorld();window[n].updateUi();},appName);
  assert.equal(await page.evaluate(n=>{const a=window[n],p=a.ctx.getImageData(200,300,1,1).data;return p[3]>0;},appName),true,'mobile driving canvas is painted');
  if(out)await page.screenshot({path:resolve(out,key+'-mobile.png')});
  await page.evaluate(n=>{window[n].setView('cockpit');window[n].updateUi();},appName);
  if(out)await page.screenshot({path:resolve(out,key+'-mobile-cockpit.png')});
  assert.equal(await page.locator('#touchWheel').isVisible(),false,'touch driving controls do not cover cockpit buttons');
  assert.equal(await page.locator('.panel-cockpit').evaluate(p=>p.getBoundingClientRect().top>=document.querySelector('.topbar').getBoundingClientRect().bottom),true,'cockpit panel clears topbar');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'no horizontal overflow');
  await page.close();
  // Also run the real animation loop, rather than relying only on frozen art captures.
  const driving=await browser.newPage({viewport:{width:1440,height:1000}});
  driving.on('pageerror',e=>errors.push(name+' real loop: '+e.message));
  await driving.goto(pathToFileURL(resolve(root,name+' simulator.html')).href);
  await driving.locator('#startBtn').click();
  await driving.waitForFunction(()=>getComputedStyle(document.getElementById('keyOverlay')).opacity==='0');
  await driving.keyboard.down('a');await driving.waitForFunction(n=>window[n].state.steer<-.1,appName);await driving.keyboard.up('a');
  await driving.keyboard.down('d');await driving.waitForFunction(n=>window[n].state.steer>.1,appName);await driving.keyboard.up('d');
  await driving.setViewportSize({width:844,height:390});await driving.waitForTimeout(250);
  assert.equal(await driving.evaluate(n=>window[n].ctx.getImageData(200,180,1,1).data[3]>0,appName),true,'real loop paints after landscape resize');
  if(out)await driving.screenshot({path:resolve(out,key+'-landscape.png')});
  await driving.close();console.log('✔ '+name+': live instruments, physical controls, cover, doors, wheels, steering, desktop/mobile');
 }
 assert.deepEqual(errors,[],'no JS or SVG errors');
 if(out)writeFileSync(resolve(out,'result.json'),JSON.stringify({cars:Object.keys(cars),errors,baseline,preserved:['SPEC','physics','audio']},null,2));
}finally{await browser.close();}
