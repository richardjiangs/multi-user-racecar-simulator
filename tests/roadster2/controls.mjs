import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch();
try{for(const version of['',' 2.0']){
 const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8000/'+encodeURIComponent('Tesla Roadster 2 simulator'+version+'.html'));await p.click('#startBtn');
 await p.evaluate(()=>{RoadsterApp.selectCircuit('JFK Airport — Runway 13R/31L');RoadsterApp.roadsterAction('drive');});
 await p.click('#worldCanvas',{position:{x:800,y:400}});
 const step=async seconds=>p.evaluate(sec=>{const a=RoadsterApp;for(let i=0;i<120*sec;i++)a.updatePhysics(1/120);},seconds);
 const state=()=>p.evaluate(()=>{const s=RoadsterApp.state;return{v:s.speedMps,alt:s.roadster.alt,yaw:s.roadster.yaw,roll:s.roadster.roll,brake:s.brake,throttle:s.throttle,rocket:s.rocket,air:s.roadster.airborne,focus:document.activeElement.tagName+':'+document.activeElement.id,keys:{...s.keys}};});
 await p.keyboard.down('w');await step(1);await p.keyboard.up('w');const ground=await state();assert.ok(ground.v>5&&ground.alt===0&&!ground.air,'Ground W accelerates');
 await p.keyboard.down('s');await step(.5);await p.keyboard.up('s');assert.ok((await state()).v<ground.v,'Ground S brakes');
 // Normal Tab navigation must remain available without Rocket selected.
 await p.keyboard.press('Tab');assert.notEqual((await state()).focus,'BODY:','Ground Tab retains keyboard navigation');
 await p.evaluate(()=>{RoadsterApp.selectCircuit('JFK Airport — Runway 13R/31L');RoadsterApp.roadsterAction('drive');});await p.click('#worldCanvas',{position:{x:800,y:400}});
 await p.keyboard.press('y');await p.keyboard.down('w');await step(2);await p.keyboard.up('w');const lifted=await state();assert.ok(lifted.alt>5&&lifted.v<.5&&lifted.rocket,'Rocket W climbs without forward acceleration');
 await p.keyboard.down('Tab');await step(1.5);await p.keyboard.up('Tab');const forward=await state();assert.ok(forward.v>5,'Flight Tab accelerates');assert.equal(forward.focus,lifted.focus,'Flight Tab does not leave the simulator');
 await p.keyboard.down('Shift');await step(1);await p.keyboard.up('Shift');assert.ok((await state()).v<forward.v*.5,'Flight Shift brakes');
 await p.keyboard.down('d');await step(.3);await p.keyboard.up('d');const bank=await state();assert.ok(bank.roll<-.15,'D banks the yoke right');assert.ok(Math.abs(bank.yaw-lifted.yaw)<.01,'A/D bank does not consume heading controls');
 await p.mouse.move(800,400);await p.mouse.wheel(180,0);await step(.3);const heading=await state();assert.ok(heading.yaw>bank.yaw+.04,'Horizontal trackpad gesture steers heading');
 const high=heading.alt;await p.keyboard.down('s');await step(.5);await p.keyboard.up('s');assert.ok((await state()).alt<high,'Flight S descends');
 await p.keyboard.press('g');await step(25);assert.equal((await state()).air,false,'G lands');await p.keyboard.press('y');assert.equal((await state()).rocket,false);await p.keyboard.down('w');await step(1);await p.keyboard.up('w');assert.ok((await state()).v>5&&(await state()).alt===0,'After disarming, W returns to ground throttle');
 const ui=await p.evaluate(()=>{const f=document.querySelector('.bottombar'),d=document.querySelector('#rsDash'),s=RoadsterApp.state;RoadsterApp.updateUi();return{footer:getComputedStyle(f).display,top:d.getBoundingClientRect().top,h:innerHeight,speed:d.querySelector('[data-rs="speed"]').textContent,expected:Math.round(s.speedMps*3.6).toString()};});assert.equal(ui.footer,'grid');assert.ok(ui.top>ui.h*.55,'Low Type A dashboard');assert.equal(ui.speed,ui.expected);
 assert.deepEqual(errors,[]);console.log('PASS Roadster '+(version||'1.0')+': ground/flight key isolation, independent yoke and touchpad, landing, Type A/live dash');await p.close();
}}finally{await browser.close();}
