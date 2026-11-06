import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch(),reports=[];
try{for(const version of(process.env.ROADSTER_TEST_FILE?[process.env.ROADSTER_TEST_FILE]:['',' 2.0'])){
 const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.stack));await p.addInitScript(()=>requestAnimationFrame=()=>0);
 const portable=!!process.env.ROADSTER_TEST_FILE;
 await p.goto(portable?pathToFileURL(version).href:'http://127.0.0.1:8000/'+encodeURIComponent('Tesla Roadster 2 simulator'+version+'.html'));
 if(portable)await p.waitForFunction(()=>window.__offlineApp,null,{polling:50,timeout:120000});
 const f=portable?await(await p.$('#simFrame')).contentFrame():p.mainFrame();await f.waitForFunction(()=>window.RoadsterApp?.roadsterRampContact,null,{polling:50});await f.click('#startBtn');
 const setup=async(name='JFK Airport — Runway 13R/31L')=>f.evaluate(async name=>{const a=RoadsterApp;a.selectCircuit(name);await a.prepareTrack?.(name);a.roadsterAction('drive');},name);
 const step=async seconds=>f.evaluate(seconds=>{const a=RoadsterApp;for(let i=0;i<seconds*120;i++){a.state.time+=1/120;a.updatePhysics(1/120);}a.updateUi();},seconds);
 const read=()=>f.evaluate(()=>{const a=RoadsterApp,s=a.state,f=s.roadster;return{...f,rocket:s.rocket,downforce:s.trackPack,speed:s.speedMps,steer:s.steer,touch:s.touchSteer,transform:document.querySelector('#rsDash [data-rs=yoke]').getAttribute('transform')};});
 // Actual trackpad events must spring back on custom ground and shared tracks.
 const roads=['JFK Airport — Runway 13R/31L','Golden Gate Bridge — Stunt Ramp','SpaceX McGregor — Demo Ramp','Tesla Development Grounds','Circuit de Monaco'];
 for(const road of roads){await setup(road);await f.evaluate(()=>{RoadsterApp.state.trackpadSteering=true;RoadsterApp.state.touchActive=false;});await p.mouse.move(800,300);await p.mouse.wheel(450,0);await f.waitForFunction(()=>RoadsterApp.state.touchSteer>.5,null,{polling:50});await step(.12);let r=await read();assert.ok(r.steer>.1&&r.yoke===0&&!r.rocket,road);await step(2);r=await read();assert.ok(Math.abs(r.steer)<.005&&r.touch===0&&r.yoke===0,'Ground swipe must spring back: '+road+' '+JSON.stringify(r));}
 await setup();await f.click('#worldCanvas',{position:{x:800,y:300}});await p.keyboard.down('v');await p.keyboard.down('v');await p.keyboard.up('v');await step(.25);let r=await read();assert.ok(r.rearJet&&r.boost>0&&r.speed>0,'V toggles the rear jet and repeats cannot toggle again');await p.keyboard.press('v');await step(.1);assert.equal((await read()).rearJet,false);assert.equal((await read()).boost,0);
 await p.keyboard.press('y');r=await read();assert.ok(r.rocket&&!r.hold&&!r.positionHold&&!r.landing,'Y must not activate any hover hold');
 await f.evaluate(()=>{const s=RoadsterApp.state;Object.assign(s.roadster,{airborne:true,y:1000,alt:1000,vz:30,throttleLever:1,hold:false,bodyAxes:null});});
 const before=await read();await p.keyboard.press('y');r=await read();assert.ok(!r.rocket&&!r.positionHold&&!r.landing&&!r.hold);assert.equal(r.vz,before.vz,'Y off preserves momentum');await p.keyboard.press('y');r=await read();assert.ok(r.rocket&&!r.positionHold&&!r.hold&&!r.landing);
 // I/O keep a full lever and actual speed, turn faster than the arrow steering,
 // and complete multiple 360-degree spins at rest without using F implicitly.
 const spins=await f.evaluate(()=>{const a=RoadsterApp,s=a.state,dt=1/120,out=[];
 for(const key of['ArrowRight','KeyO','KeyI']){a.selectCircuit('JFK Airport — Runway 13R/31L');a.roadsterAction('drive');a.toggleRocket();Object.assign(s.roadster,{airborne:true,y:1000,alt:1000,vz:60,vx:0,vy:0,throttleLever:1,hold:false});s.speedMps=60;s.keys={[key]:true};let angle=0,minStep=Infinity,last=60;for(let i=0;i<1200;i++){const yaw=s.roadster.yaw;a.updatePhysics(dt);angle+=Math.atan2(Math.sin(s.roadster.yaw-yaw),Math.cos(s.roadster.yaw-yaw));minStep=Math.min(minStep,s.speedMps-last);last=s.speedMps;}out.push({key,angle,minStep,speed:s.speedMps,lever:s.roadster.throttleLever,held:s.roadster.positionHold});}
 a.selectCircuit('JFK Airport — Runway 13R/31L');a.roadsterAction('drive');a.toggleRocket();Object.assign(s.roadster,{airborne:true,y:100,alt:100,hold:false});s.keys={KeyO:true};for(let i=0;i<400;i++)a.updatePhysics(dt);out.push({stationary:true,x:s.roadster.x,z:s.roadster.z,speed:s.speedMps,held:s.roadster.positionHold});a.roadsterAction('hover');s.keys={KeyO:true,ArrowUp:true};for(let i=0;i<240;i++)a.updatePhysics(dt);out.push({pedal:true,speed:s.speedMps,held:s.roadster.positionHold});s.keys={};return out;});
 for(const r of spins.slice(0,3)){assert.equal(r.lever,1);assert.equal(r.held,false);assert.ok(r.minStep>0,JSON.stringify(r));}assert.ok(spins[1].angle>spins[0].angle*1.8&&spins[2].angle<0);assert.ok(spins[3].speed<1e-7&&!spins[3].held);assert.ok(spins[4].speed>10&&!spins[4].held);
 const contact=await f.evaluate(()=>{const a=RoadsterApp,s=a.state,dt=1/120,out={landings:[],water:[],terrain:[]},step=sec=>{for(let i=0;i<sec*120;i++){s.time+=dt;a.updatePhysics(dt);}},setup=name=>{a.selectCircuit(name);a.roadsterAction('drive');s.realMode=false;},snap=()=>({x:s.roadster.x,y:s.roadster.y,z:s.roadster.z,vy:s.roadster.vy,air:s.roadster.airborne,water:s.roadster.waterContact,contact:!!s.roadster.rampContact,grip:s.roadster.gripForce,speed:s.speedMps});
 // Z blocks P/W lifting even with Rocket armed and the normal throttle at 100%.
 setup('JFK Airport — Runway 13R/31L');a.toggleRocket();a.toggleTrackPack();s.roadster.throttleLever=1;s.keys={KeyP:true,KeyW:true};step(2);out.pinned=snap();s.keys={};
 // Land on the inverted shelf from either heading, away from the ramp entrance.
 for(const real of[false,true])for(const facing of[0,Math.PI/2,Math.PI,-Math.PI/2]){setup('SpaceX McGregor — Demo Ramp');a.toggleRocket();a.toggleTrackPack();s.realMode=real;s.roadster.gas=0;const r=a.roadsterRampGeometry;Object.assign(s.roadster,{x:0,y:r.height-5,z:r.topZ-1000,yaw:facing,pitch:0,roll:Math.PI,airborne:true,hold:false,bodyAxes:null,vx:0,vy:0,vz:0});step(5);const landed=snap();step(4);out.landings.push({real,facing,landed,held:snap()});}
 for(const real of[false,true]){
  setup('Golden Gate Bridge — Stunt Ramp');s.realMode=real;Object.assign(s.roadster,{x:150,y:5,z:1000,airborne:true,hold:false,vy:-12});step(2);const wet=snap();step(1);const sinking=snap();a.toggleRocket();s.keys={KeyP:true};step(2);s.keys={};const rescued=snap();
  setup('Golden Gate Bridge — Stunt Ramp');s.realMode=real;Object.assign(s.roadster,{x:150,y:-4,z:1000,airborne:true,hold:false,vy:0});let reset=null;for(let i=0;i<2000;i++){const before=snap();a.updatePhysics(dt);if(s.roadster.x===-4){reset={before,after:snap(),seconds:i*dt};break;}}out.water.push({real,wet,sinking,rescued,reset});
 }
 setup('Golden Gate Bridge — Stunt Ramp');a.toggleRocket();Object.assign(s.roadster,{x:150,z:1000,y:-4,airborne:true,hold:true,holdY:-4});step(1);out.armedSink=snap();
 // Flying below the bridge or outside its rails cannot snap to deck height/center.
 setup('Golden Gate Bridge — Stunt Ramp');Object.assign(s.roadster,{x:0,z:1000,y:5,airborne:true,hold:false,vy:-2});step(.3);out.under=snap();
 setup('Golden Gate Bridge — Stunt Ramp');a.toggleRocket();Object.assign(s.roadster,{x:500,z:1000,y:68,airborne:true,hold:true,holdY:68});step(.2);out.outside=snap();
 // Land and drive on island and mountain triangles, with no penetration.
 for(const [x,z]of[[-1000,-1000],[-800,3500],[800,4500]]){setup('Golden Gate Bridge — Stunt Ramp');const terrain=a.roadsterTerrainAt(x,z);Object.assign(s.roadster,{x,z,y:terrain.y+2,airborne:true,hold:false,vy:-2});step(1);const landed=snap();s.keys={KeyW:true};let maxError=0;for(let i=0;i<240;i++){a.updatePhysics(dt);maxError=Math.max(maxError,Math.abs(s.roadster.y-a.roadsterTerrainAt(s.roadster.x,s.roadster.z).y));}s.keys={};out.terrain.push({x,z,landed,driven:snap(),maxError});}
 a.drawWorld();a.updateUi();return out;});
 assert.ok(!contact.pinned.air&&contact.pinned.grip>0);
 for(const r of contact.landings){assert.ok(r.landed.contact&&!r.landed.air,JSON.stringify(r));assert.ok(r.held.contact&&Math.abs(r.held.y-r.landed.y)<1e-7&&r.held.grip>9.8,JSON.stringify(r));}
 for(const r of contact.water){assert.ok(r.wet.water&&r.wet.x>100&&r.sinking.y<r.wet.y&&r.sinking.y>-5.25,JSON.stringify(r));assert.ok(r.rescued.y>0&&!r.rescued.water&&r.rescued.x>100,JSON.stringify(r));assert.ok(r.reset&&r.reset.seconds>2&&r.reset.before.y<-5.2&&r.reset.after.y===67,JSON.stringify(r));}
 assert.ok(contact.armedSink.y< -4.1&&contact.armedSink.water);
 assert.ok(contact.under.y<5&&contact.under.x===0);assert.ok(contact.outside.x>490&&contact.outside.y<70);
 for(const r of contact.terrain){assert.ok(!r.landed.air&&!r.driven.air&&r.maxError<1e-7&&r.driven.speed>5,JSON.stringify(r));}
 assert.deepEqual(errors,[]);reports.push({version:version||'1.0',spins,contact});console.log('PASS',version||'1.0','ground touchpad, V toggle, Y isolation, faster I/O, Z grip, inverted landings both headings, water sink/escape/recovery, solid terrain');await p.close();
}}finally{fs.writeFileSync('/tmp/roadster-contact-controls-results.json',JSON.stringify(reports,null,2));await browser.close();}
