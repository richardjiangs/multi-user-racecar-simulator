import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const {chromium}=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json')('playwright');
const browser=await chromium.launch();
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const close=(a,b,label,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${label}: ${a} != ${b}`);
const vector=(a,b,label,tol=1e-8)=>a.forEach((v,i)=>close(v,b[i],label+' '+i,tol));
try{
 for(const version of process.env.ROADSTER_TEST_FILE?['download']:['1','2']){
  const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>window.requestAnimationFrame=()=>0);
  const file=process.env.ROADSTER_TEST_FILE;
  if(file)await p.route(/^https?:/,r=>r.abort());
  await p.goto(file?pathToFileURL(file).href:(process.env.TEST_BASE_URL||'http://127.0.0.1:8000/')+encodeURIComponent('Tesla Roadster 2 simulator'+(version==='2'?' 2.0':'')+'.html'));
  if(file)await p.waitForFunction(()=>window.__offlineApp?.roadsterAttitudeInfo,null,{polling:50,timeout:120000});
  const frame=file?await(await p.$('#simFrame')).contentFrame():p.mainFrame();
  await frame.waitForFunction(()=>window.RoadsterApp?.roadsterAttitudeInfo,null,{polling:50});
  await frame.click('#startBtn');
  const step=sec=>frame.evaluate(sec=>{const a=RoadsterApp;for(let i=0;i<Math.round(sec*120);i++){a.state.time+=1/120;a.updatePhysics(1/120);}},sec);
  const state=()=>frame.evaluate(()=>({f:structuredClone(RoadsterApp.state.roadster),axes:RoadsterApp.roadsterAttitudeInfo(),speed:RoadsterApp.state.speedMps}));
  const hold=async(key,sec)=>{await p.keyboard.down(key);await step(sec);await p.keyboard.up(key);};
  // Each long hover assertion starts with a full tank; gas exhaustion has its own regression suite.
  const hover=async()=>{await frame.evaluate(()=>RoadsterApp.state.roadster.gas=1);await p.keyboard.press('f');};
  const setup=async(route,real=false,pitch=0)=>{
   await frame.evaluate(async({route,real,pitch})=>{const a=RoadsterApp;a.selectCircuit(route);await a.prepareTrack?.(route);a.roadsterAction('drive');a.toggleRocket();a.state.realMode=real;a.state.touchActive=false;a.state.touchSteer=0;Object.assign(a.state.roadster,{x:0,y:10000,z:1000,alt:10000,airborne:true,hold:false,positionHold:false,throttleLever:0,vx:0,vy:0,vz:0,pitch,roll:0,yaw:0,yoke:0,bodyAxes:null});},{route,real,pitch});
   await frame.locator('#worldCanvas').click({position:{x:700,y:250}});
  };
  const routes=version==='1'?['JFK Airport — Runway 13R/31L']:['JFK Airport — Runway 13R/31L','Circuit de Monaco'];
  for(const route of routes)for(const real of[false,true]){
   // Reproduce the reported half backflip, 180° roll upright, G, then F.
   await setup(route,real);
   await hold('w',Math.PI/.75);await hold('d',2);
   const before=await state();assert.ok(before.axes.up[1]>.999,'Rolled upright after backflip');
   await p.keyboard.press('g');const centered=await state();
   for(const k of['x','y','z','vx','vy','vz'])close(centered.f[k],before.f[k],'G preserves '+k);
   for(const k of['right','up','forward'])vector(centered.axes[k],before.axes[k],'G preserves '+k);
   close(centered.f.yoke,0,'G resets degrees');
   await hover();
   for(let i=0;i<120;i++){await step(1/12);const q=await state();for(const k of['right','up','forward'])vector(q.axes[k],centered.axes[k],'F must not rotate rebased '+k);}
   const stopped=await state();assert.ok(Math.hypot(stopped.f.vx,stopped.f.vy,stopped.f.vz)<.001,'F holds still '+JSON.stringify({real,gas:stopped.f.gas,velocity:[stopped.f.vx,stopped.f.vy,stopped.f.vz]}));

   // A tilted neutral stays tilted; future roll and pitch start from that frame.
   await setup(route,real);await hold('w',.4);await hold('d',1);
   await p.keyboard.press('g');const neutral=await state();
   await hover();await step(4);let q=await state();
   for(const k of['right','up','forward'])vector(q.axes[k],neutral.axes[k],'Tilted G→F '+k);
   await hold('d',1);q=await state();close(q.f.yoke,90,'Next degree command is relative to G');
   vector(q.axes.right,neutral.axes.up.map(v=>-v),'90° roll about new neutral nose');
   await hover();await step(10);q=await state();vector(q.axes.up,neutral.axes.up,'F returns to rebased bank/pitch',2e-8);close(q.f.yoke,0,'F centers relative yoke');
   for(const key of['w','s']){
    const beforePitch=await state();await hold(key,.4);q=await state();const t=(key==='w'?1:-1)*.3;
    vector(q.axes.forward,beforePitch.axes.forward.map((v,i)=>v*Math.cos(t)+beforePitch.axes.up[i]*Math.sin(t)),'Rebased body pitch '+key);
    await hover();await step(10);
   }
   // G during an existing F correction cancels its old target immediately.
   await hold('d',1);await hover();await step(.1);await p.keyboard.press('g');const mid=await state();await step(2);q=await state();vector(q.axes.up,mid.axes.up,'G replaces active hover reference');
  }

  // G+2 is roll recovery, not a heading reset. Exercise both chord orders,
  // repeated keydown, reverse-facing backflips, pitch and a vertical nose.
  for(const real of[false,true])for(const pitch of[Math.PI,.6,Math.PI/2])for(const order of[['g','2'],['2','g']]){
   await setup('JFK Airport — Runway 13R/31L',real,pitch);await hold('d',.7);
   await frame.evaluate(()=>{const a=RoadsterApp,f=a.state.roadster,b=a.roadsterAttitudeInfo();[f.vx,f.vy,f.vz]=b.forward.map(v=>v*30);f.throttleLever=.65;a.state.speedMps=30;});
   const before=await state();await p.keyboard.down(order[0]);await p.keyboard.down(order[1]);await p.keyboard.down(order[1]);await p.keyboard.up(order[1]);await p.keyboard.up(order[0]);const q=await state();
   vector(q.axes.forward,before.axes.forward,'G+2 preserves nose, including reverse facing');
   for(const k of['x','y','z','vx','vy','vz','throttleLever','hold','positionHold'])assert.equal(q.f[k],before.f[k],'G+2 preserves '+k);
   close(q.speed,before.speed,'G+2 preserves speed');close(q.f.yoke,0,'G+2 centers yoke');
   if(pitch===Math.PI/2)vector(q.axes.up,before.axes.up,'Vertical nose has no unique road roll zero');
   else{close(q.axes.right[1],0,'G+2 horizontal right axis on flat track');assert.ok(q.axes.up[1]>0,'G+2 upright');}
   await hover();await step(10);const held=await state();for(const k of['right','up','forward'])vector(held.axes[k],q.axes[k],'F keeps the G+2 reference');
   if(!real&&pitch===Math.PI){
    await frame.evaluate(()=>{const f=RoadsterApp.state.roadster;Object.assign(f,{x:0,z:1000,y:5,alt:5,vx:0,vy:0,vz:0});RoadsterApp.roadsterAction('land');});await step(20);const landed=await state();assert.equal(landed.f.airborne,false);assert.ok(landed.axes.forward[2]<-.999,'Landing cannot turn the reverse-facing car around');
   }
  }
  // Matching touch action and uncombined 2 must not interfere with plain G.
  await setup('JFK Airport — Runway 13R/31L');await hold('d',2);const inverted=await state();await p.keyboard.press('2');vector((await state()).axes.up,inverted.axes.up,'2 alone does not reset roll');
  await frame.locator('#rsHelp summary').click();await frame.locator('[data-rs-action="recenterTrack"]').click();assert.ok((await state()).axes.up[1]>.999);await frame.locator('#rsHelp summary').click();
  if(version!=='1'){
   await setup('Nardò Ring');await frame.evaluate(()=>{const a=RoadsterApp,p=a.surfacePoint(100,0);Object.assign(a.state.roadster,{x:p.x,y:p.y+100,z:p.z,yaw:p.psi,pitch:Math.atan(p.grade),roll:.8,bodyAxes:null});});
   const before=await state();await p.keyboard.down('g');await p.keyboard.press('2');await p.keyboard.up('g');const banked=await state();
   vector(banked.axes.forward,before.axes.forward,'Track alignment keeps nose');close(banked.f.roll,Math.atan(-.125),'G+2 uses Nardò centerline crossfall',.003);
  }
  await setup('SpaceX McGregor — Demo Ramp');await frame.evaluate(()=>{const a=RoadsterApp;a.toggleTrackPack();a.state.roadster.rampContact={q:a.roadsterRampGeometry.invertedStart+100,heading:0};a.state.roadster.airborne=false;a.state.speedMps=0;});await step(1/120);
  const shelf=await state();await p.keyboard.down('g');await p.keyboard.press('2');await p.keyboard.up('g');const shelfReset=await state();vector(shelfReset.axes.up,shelf.axes.up,'Inverted road contact uses its own surface normal');assert.ok(shelfReset.f.rampContact&&shelfReset.axes.up[1]<-.999);
  // Every steering source uses body-right, including inverted/vertical flight.
  for(const bank of[0,90,180,270,720])for(const pitch of[0,Math.PI/2])for(const control of['ArrowRight','ArrowLeft','o','i','swipe','touch']){
   await setup('JFK Airport — Runway 13R/31L',false,pitch);
   if(bank)await hold('d',bank/90);
   await p.keyboard.press('g');const basis=await state();
   await frame.evaluate(()=>{const a=RoadsterApp,f=a.state.roadster,b=a.roadsterAttitudeInfo();[f.vx,f.vy,f.vz]=b.forward.map(v=>v*30);f.throttleLever=1;f.hold=false;f.positionHold=false;a.state.speedMps=30;});
   if(control==='swipe')await p.mouse.wheel(120,0);
   else if(control==='touch')await frame.evaluate(()=>{RoadsterApp.state.touchActive=true;RoadsterApp.state.touchSteer=1;});
   else await p.keyboard.down(control);
   await step(.1);
   if(!['swipe','touch'].includes(control))await p.keyboard.up(control);
   const q=await state(),sign=['ArrowLeft','i'].includes(control)?-1:1;
   assert.ok(dot(q.axes.forward,basis.axes.right)*sign>.005,`${control} must turn toward current body side at bank ${bank}, pitch ${pitch}`);
   vector(q.axes.up,basis.axes.up,'Steering preserves body-up axis');
   const v=[q.f.vx,q.f.vy,q.f.vz],speed=Math.hypot(...v);
   assert.ok(speed>30,'Full throttle retains speed during body turn');vector(v.map(x=>x/speed),q.axes.forward,'Velocity turns with nose');
   close(q.f.yoke,0,'Steering cannot rotate degree yoke');
  }
  assert.deepEqual(errors,[]);await p.close();
  console.log('PASS neutral frame '+version+': flip/G/F, G+2 both key orders/touch, reverse heading retained through landing, tilted reset, relative pitch and all steering sources at 0/90/180/270/720° and vertical flight.');
 }
}finally{await browser.close();}
