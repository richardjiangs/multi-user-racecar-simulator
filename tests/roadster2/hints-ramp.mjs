import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch(),results=[];
try {for(const edition of(process.env.ROADSTER_TEST_FILE?[process.env.ROADSTER_TEST_FILE]:['',' 2.0'])){
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.stack));
 await page.addInitScript(()=>requestAnimationFrame=()=>0);
 const portable=!!process.env.ROADSTER_TEST_FILE;
 await page.goto(portable?pathToFileURL(edition).href:'http://127.0.0.1:8000/'+encodeURIComponent('Tesla Roadster 2 simulator'+edition+'.html'));
 if(portable)await page.waitForFunction(()=>window.__offlineApp,null,{polling:50,timeout:120000});
 const f=portable?await(await page.$('#simFrame')).contentFrame():page.mainFrame();
 await f.waitForFunction(()=>window.RoadsterApp?.roadsterRampContact,null,{polling:50});
 await f.click('#startBtn');
 const report=await f.evaluate(async()=>{
  const a=RoadsterApp,s=a.state,dt=1/120,G=a.roadsterModel.gravity;
  const step=sec=>{for(let i=0;i<Math.round(sec/dt);i++){s.time+=dt;a.updatePhysics(dt);}a.drawWorld();a.updateUi();};
  const setup=async(name='SpaceX McGregor — Demo Ramp')=>{a.selectCircuit(name);await a.prepareTrack?.(name);a.roadsterAction('drive');s.keys={};s.realMode=false;};
  const state=()=>({contact:!!s.roadster.rampContact,q:s.roadster.rampContact?.q,air:s.roadster.airborne,y:s.roadster.y,z:s.roadster.z,vy:s.roadster.vy,vz:s.roadster.vz,v:s.speedMps,grip:s.roadster.gripForce,gas:s.roadster.gas,up:a.roadsterAttitudeInfo().up});
  const report={hints:[],holds:[],G};
  for(const name of [...Object.keys(a.roadsterScenes),'Circuit de Monaco']){
   await setup(name);a.toggleLights();step(1);
   const first={timer:s.toastTimer,shown:a.el.toast.classList.contains('show')};step(2.1);
   report.hints.push({name,phase:'ground',first,expired:!a.el.toast.classList.contains('show')});
   if(a.roadsterScene()||a.trackFrame){a.toggleRocket();Object.assign(s.roadster,{airborne:true,y:200,hold:true,holdY:200});step(1);const first={timer:s.toastTimer,shown:a.el.toast.classList.contains('show')};step(2.1);report.hints.push({name,phase:'flight',first,expired:!a.el.toast.classList.contains('show')});}
  }
  const geometry=a.roadsterRampGeometry,arc=geometry.invertedStart;
  const enter=async(rocket=true)=>{await setup();if(rocket)a.toggleRocket();a.toggleTrackPack();Object.assign(s.roadster,{x:0,z:geometry.z-1,y:0});s.speedMps=20;for(let i=0;i<6000;i++){s.keys=s.speedMps<20?{ArrowUp:true}:s.speedMps>21?{ArrowDown:true}:{};a.updatePhysics(dt);if(s.roadster.rampContact?.q>arc+1)break;}s.keys={};return state();};
  // Approach with the normal driver integrator, then stop well before the open edge.
  report.entry=await enter();s.keys={ArrowDown:true};step(4);s.keys={};report.braked=state();
  // Place the stopped contact at a known shelf point to audit normal-force balance.
  if(!s.roadster.rampContact)throw Error('Braking left the shelf: '+JSON.stringify(report.braked));
  s.roadster.rampContact.q=arc+8;s.speedMps=0;s.roadster.throttleLever=0;step(1);
  a.showToast('Ramp grip ready');step(3.1);report.rampHintExpired=!a.el.toast.classList.contains('show');
  for(const real of[false,true]){s.realMode=real;s.roadster.gas=0;step(10);const p=a.roadsterRampAt(s.roadster.rampContact.q,s.roadster.x);report.holds.push({...state(),real,normal:s.roadster.normalForce,residual:s.roadster.normalForce/a.SPEC.massKg-s.roadster.gripForce-G*p.up[1]});}
  // W is local pitch, not an implicit break in sealed ramp contact.
  s.keys={KeyW:true};step(1);s.keys={};report.pitch=state();
  // Rocket-off road controls work without losing electrically powered suction.
  a.toggleRocket();step(.2);report.disarmed={...state(),rocket:s.rocket};
  s.gearMode='R';s.keys={KeyW:true};let reversed=false;for(let i=0;i<6000;i++){a.updatePhysics(dt);if(!s.roadster.rampContact&&!s.roadster.airborne&&s.roadster.z<geometry.z){reversed=true;break;}}s.keys={};report.reverse={...state(),reversed};
  // Actual loss of suction power releases the underside, with gravity taking over.
  await enter();s.roadster.rampContact.q=arc+8;s.speedMps=0;step(.1);const before=state();s.ignition=false;s.rocket=false;s.realMode=true;s.roadster.gas=0;step(.5);report.powerOff={before,after:state()};
  // Forward passage reaches a finite elevated edge; it must never teleport to ground.
  await enter();s.keys={ArrowUp:true};let edge=null,previous=state();for(let i=0;i<9000;i++){a.updatePhysics(dt);if(previous.contact&&!s.roadster.rampContact){edge={before:previous,after:state()};break;}previous=state();}s.keys={};report.edge=edge;
  // Flying from below into the driving face captures tyres rather than passing through.
  await setup();a.toggleRocket();a.toggleTrackPack();Object.assign(s.roadster,{x:0,y:geometry.height-5,z:geometry.topZ-12,pitch:Math.PI,roll:0,airborne:true,hold:false,vx:0,vy:12,vz:0});step(1.5);report.capture=state();
  report.geometry={...geometry,start:a.roadsterRampAt(0),end:a.roadsterRampAt(geometry.length)};
  // Render the finished open structure from the side for visual inspection.
  Object.assign(s.roadster,{x:200,y:50,z:geometry.topZ-60,yaw:-Math.PI/2,pitch:0,roll:0,airborne:true,rampContact:null,bodyAxes:null});a.drawWorld();a.updateUi();
  return report;
 });
 for(const h of report.hints){assert.ok(h.first.shown);assert.ok(Math.abs(h.first.timer-2)<.01,JSON.stringify(h));assert.ok(h.expired,JSON.stringify(h));}
 assert.ok(report.rampHintExpired);assert.ok(report.entry.contact&&report.braked.contact);assert.ok(Math.abs(report.braked.v)<.01,'Brakes stop the car on the underside');
 for(const h of report.holds){assert.ok(h.contact&&!h.air&&Math.abs(h.v)<.01);assert.ok(h.up[1]<-.999);assert.ok(h.grip>=report.G);assert.ok(h.normal>0);assert.ok(Math.abs(h.residual)<1e-7);if(h.real)assert.equal(h.gas,0);}
 assert.ok(report.pitch.contact&&!report.pitch.air);assert.ok(report.disarmed.contact&&!report.disarmed.rocket);assert.ok(report.reverse.reversed);
 assert.ok(report.powerOff.after.air&&report.powerOff.after.y<report.powerOff.before.y&&report.powerOff.after.vy<0);
 assert.ok(report.edge.after.air&&!report.edge.after.contact);assert.ok(report.edge.after.y>40&&report.edge.after.up[1]<-.999);assert.ok(Math.abs(report.edge.after.v-report.edge.before.v)<1);assert.ok(report.edge.after.vz<0);
 assert.ok(report.capture.contact&&!report.capture.air&&report.capture.y<report.geometry.height);
 assert.equal(report.geometry.straight,2000);assert.ok(Math.abs(report.geometry.topZ-report.geometry.end.z-2000)<1e-8);assert.ok(report.geometry.end.y>40&&report.geometry.end.up[1]<-.999&&report.geometry.end.z<report.geometry.start.z);
 assert.deepEqual(errors,[]);await page.screenshot({path:portable?'/tmp/roadster-ramp-download.png':'/tmp/roadster-ramp-open'+(edition?'2':'1')+'.png'});results.push({edition:edition||'1.0',...report});await page.close();console.log('PASS hints + open ramp / stopping / reverse / suction / power loss / exit / capture:',edition||'1.0');
 }}finally{fs.writeFileSync('/tmp/roadster-hints-ramp-results.json',JSON.stringify(results,null,2));await browser.close();}
