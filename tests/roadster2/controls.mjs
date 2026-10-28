import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch();
const garage=process.argv.includes('--garage'),base=process.env.TEST_BASE_URL||'http://127.0.0.1:8000/';
try{for(const version of['',' 2.0']){
 const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 let f;
 if(garage){await p.goto(base);await p.waitForFunction(()=>window.__mucs);await p.selectOption('#trackVersion',version?'2':'1');await p.evaluate(()=>__mucs.openPractice('roadster2'));await p.waitForFunction(()=>__mucs.getSimApp()?.roadsterReadInputs);f=await (await p.$('#simFrame')).contentFrame();}
 else{await p.goto(base+encodeURIComponent('Tesla Roadster 2 simulator'+version+'.html'));f=p.mainFrame();}
 await f.click('#startBtn');
 const reset=async(name='JFK Airport — Runway 13R/31L')=>{await f.evaluate(async name=>{const a=RoadsterApp;a.selectCircuit(name);await a.prepareTrack?.(name);a.roadsterAction('drive');},name);await f.click('#worldCanvas',{position:{x:800,y:300}});};
 const step=async seconds=>f.evaluate(sec=>{const a=RoadsterApp;for(let i=0;i<120*sec;i++){a.state.time+=1/120;a.updatePhysics(1/120);}},seconds);
 const state=()=>f.evaluate(()=>{const s=RoadsterApp.state,f=s.roadster;return{v:s.speedMps,alt:f.alt,yaw:f.yaw,yawCommand:f.yawCommand,yawInput:f.yawInput,pitch:f.pitch,roll:f.roll,yoke:f.yoke,lever:f.throttleLever,x:f.x,z:f.z,vx:f.vx,vz:f.vz,vy:f.vy,brake:s.brake,throttle:s.throttle,rocket:s.rocket,air:f.airborne,positionHold:f.positionHold,holdX:f.holdX,holdZ:f.holdZ,launch:s.launchArmed,trackpad:s.trackpadSteering,focus:document.activeElement.tagName+':'+document.activeElement.id,keys:{...s.keys}};});
 const hold=async(key,seconds)=>{await p.keyboard.down(key);await step(seconds);const during=await state();await p.keyboard.up(key);return during;};
 await reset();await hold('w',1);const ground=await state();assert.ok(ground.v>5&&ground.alt===0&&!ground.air,'Ground W accelerates');await hold('s',.5);assert.ok((await state()).v<ground.v,'Ground S brakes');
 await p.keyboard.press('Tab');assert.notEqual((await state()).focus,'BODY:','Ground Tab retains navigation');
 for(const circuit of['JFK Airport — Runway 13R/31L','Circuit de Monaco']){
  await reset(circuit);await p.keyboard.press('y');await hold('w',1);let v=await state();assert.ok(v.v<1&&v.throttle===0&&!v.air,'Rocket W cannot feed old ground accelerator on '+circuit+' '+JSON.stringify(v));
  // Genuine repeated keydown events must not continually advance the lever.
  await p.keyboard.down('Tab');await p.keyboard.down('Tab');await step(.2);await p.keyboard.up('Tab');assert.equal((await state()).lever,.05);
  for(let i=0;i<9;i++)await p.keyboard.press('Tab');await step(1);v=await state();assert.equal(v.lever,.5);assert.equal(v.throttle,.5);assert.ok(v.v>1,'Held lever actually accelerates on '+circuit);
  await p.keyboard.press('Shift');await step(.1);assert.equal((await state()).lever,.45);
  await hold('ArrowUp',.4);assert.equal((await state()).lever,.45);await step(.1);assert.equal((await state()).throttle,.45);
  const braking=await hold('ArrowDown',1);assert.equal(braking.lever,.45);assert.equal(braking.throttle,0);await step(.1);assert.equal((await state()).throttle,.45);
 }
 await reset();await p.keyboard.press('y');await hold('p',2);const lifted=await state();assert.ok(lifted.alt>5&&lifted.v<.1&&Math.abs(lifted.pitch)<.001,'P is vertical hover, no forward drive or nose pitch');assert.equal(lifted.launch,false);
 await hold('l',.7);assert.ok((await state()).vy<0,'L lowers hover');assert.equal((await state()).launch,false,'L never arms legacy launch in Rocket mode');
 // Flight keys work after clicking the existing pedal range, too.
 await f.focus('#throttleSlider');for(let i=0;i<10;i++)await p.keyboard.press('Tab');await step(2);let forward=await state();assert.equal(forward.lever,.5);assert.ok(forward.v>5,'Lever produces actual forward flight');
 assert.equal((await hold('ArrowUp',.3)).throttle,1);await step(.1);assert.equal((await state()).throttle,.5);
 forward=await state();await hold('ArrowDown',1);assert.ok((await state()).v<forward.v*.6,'ArrowDown brakes actual velocity');await step(.1);assert.equal((await state()).throttle,.5);
 await f.locator('#throttleSlider').evaluate(el=>{el.value=60;el.dispatchEvent(new Event('input',{bubbles:true}));});await p.keyboard.press('Shift');await step(.1);assert.equal((await state()).lever,.55);assert.equal((await state()).throttle,.55,'Slider and keyboard use one lever');await p.keyboard.press('Shift');
 await f.click('#rsHelp summary');await f.click('#rsTouch [data-rs-action="throttleUp"]');assert.equal((await state()).lever,.55);await f.click('#rsTouch [data-rs-action="throttleDown"]');assert.equal((await state()).lever,.5);await f.click('#rsHelp summary');
 await f.click('#worldCanvas',{position:{x:800,y:300}});await hold('d',.5);const bank=await state();assert.ok(bank.yoke>.3);await step(1);let after=await state();assert.equal(after.yoke,bank.yoke,'Yoke keeps its deflection');assert.ok(after.roll<-.3);assert.ok(Math.abs(after.yaw-bank.yaw)<.001,'Bank and heading are independent');
 await p.keyboard.press('f');const anchor=await state();await step(25);let settled=await state();assert.equal(settled.yoke,0);assert.equal(settled.lever,0);assert.equal(settled.positionHold,true);assert.ok(Math.hypot(settled.x-anchor.holdX,settled.z-anchor.holdZ)<.05,'F returns to the captured fixed hover point '+JSON.stringify({anchor,settled}));
 // Real key events must reach I/O, never the old pitch alias or generic controls.
 for(const key of ['i','o']){const start=await state(),turns=[];await p.keyboard.down(key);for(let i=0;i<8;i++){const before=await state();await step(.65);const after=await state();turns.push(Math.atan2(Math.sin(after.yaw-before.yaw),Math.cos(after.yaw-before.yaw)));}await p.keyboard.up(key);const end=await state(),total=turns.reduce((a,b)=>a+b,0);assert.ok(key==='i'?total<-2*Math.PI:total>2*Math.PI,'I/O rotate the full 360° in the intended direction');assert.ok(Math.hypot(end.x-start.x,end.z-start.z)<.05);assert.ok(Math.abs(end.pitch)<.001,'I is yaw, never old pitch');}
 const still=await state();await hold('ArrowRight',1);const atRest=await state();assert.ok(Math.abs(atRest.yaw-still.yaw)<.001,'Normal steering at rest cannot become in-place yaw');
 for(let i=0;i<10;i++)await p.keyboard.press('Tab');await step(3);assert.equal((await state()).positionHold,false,'Increasing throttle releases F hold');
 // Fullscreen used to read stale touchSteer instead of the flight wheel command.
 await f.focus('#rsDash [data-rs-action=rocket]');await p.keyboard.down('Space');await p.keyboard.down('t');await p.keyboard.up('t');await p.keyboard.up('Space');assert.equal((await state()).rocket,true,'Space-first fullscreen chord cannot toggle focused Rocket button');await p.waitForTimeout(150);assert.equal((await state()).trackpad,true,'Immediate fullscreen trackpad chord');
 let before=await state();await p.mouse.move(800,300);await p.mouse.wheel(240,0);await f.waitForFunction(()=>RoadsterApp.state.roadster.yawCommand>.2);await step(.25);after=await state();assert.ok(after.yaw>before.yaw+.03,'Fullscreen horizontal swipe steers heading '+JSON.stringify({version,before,after}));assert.ok(after.vx>before.vx+.02,'Swipe also turns actual trajectory');
 await p.keyboard.press('Escape');await f.focus('#rsDash [data-rs-action=rocket]');await p.keyboard.down('t');await p.keyboard.press('Space');await p.keyboard.up('t');await f.waitForFunction(()=>RoadsterApp.state.trackpadSteering);assert.equal((await state()).rocket,true,'T-first fullscreen chord leaves Rocket armed');await p.keyboard.press('Escape');await hold('ArrowRight',.3);const right=await state();await hold('ArrowLeft',.5);assert.ok((await state()).yaw<right.yaw-.1,'Arrow steering in flight');
 // Touch wheel is independently usable and does not overwrite the held bank yoke.
 if(garage)await p.evaluate(()=>installGarageControls(document.querySelector('#simFrame').contentWindow,'dpad'));
 else await f.evaluate(()=>{document.querySelector('#touchWheel').style.setProperty('display','block','important');});
 const rect=await f.locator('#touchWheel').boundingBox();await p.mouse.move(rect.x+rect.width*.8,rect.y+rect.height*.5);await p.mouse.down();await p.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.85);before=await state();await step(.3);after=await state();await p.mouse.up();assert.ok(after.yaw>before.yaw+.03,'Physical touch wheel steers flight');
 // Start high enough to exercise every pitch angle without a ground collision.
 await f.evaluate(()=>{const s=RoadsterApp.state;Object.assign(s.roadster,{x:0,z:1000,y:500,alt:500,vx:0,vy:0,vz:25,yaw:0,pitch:0,roll:0,yoke:0,yawCommand:0,throttleLever:1,hold:false,positionHold:false});});
 await hold('w',1);after=await state();assert.ok(after.pitch>.7&&after.vy>1,'W tilts and climbs under forward thrust');assert.equal(after.throttle,1);await hold('w',8);after=await state();assert.ok(after.pitch>Math.PI*2,'W allows a full somersault');
 await hold('s',10);after=await state();assert.ok(after.pitch<0,'S pitches through a full rotation in the opposite direction');assert.equal(after.brake,0,'S cannot leak into legacy brakes');
 await f.evaluate(()=>{RoadsterApp.drawWorld();RoadsterApp.updateUi();});assert.ok(Object.values(after).filter(x=>typeof x==='number').every(Number.isFinite));
 const ui=await f.evaluate(()=>{const d=document.querySelector('#rsDash');return{footer:getComputedStyle(document.querySelector('.bottombar')).display,top:d.getBoundingClientRect().top,h:innerHeight,levers:d.querySelector('[data-rs="controlMode"]').textContent,gl:RoadsterApp.roadsterWorldInfo().webglError};});assert.equal(ui.gl,0);assert.equal(ui.footer,'grid');assert.ok(ui.top>ui.h*.55);assert.match(ui.levers,/THROTTLE 100% · YOKE 0%/);
 await f.evaluate(()=>Object.assign(RoadsterApp.state.roadster,{y:12,alt:12,vy:0,vx:0,vz:0}));await p.keyboard.press('g');await step(30);assert.equal((await state()).air,false,'G lands');assert.equal((await state()).lever,0);await p.keyboard.press('y');assert.equal((await state()).rocket,false);await hold('w',1);assert.ok((await state()).v>5&&(await state()).alt===0,'Disarming restores normal road controls');
 assert.deepEqual(errors,[]);console.log('PASS '+(garage?'garage':'standalone')+' Roadster '+(version||'1.0')+': both input paths, persistent levers, arrows, fixed-position F hold, keyboard I/O full spins, hover/pitch/loops, fullscreen/touch steering, landing, Type A');await p.close();
}}finally{await browser.close();}
