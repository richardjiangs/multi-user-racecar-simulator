import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(process.env.CODEX_NODE_MODULES+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true});
const audit=JSON.parse(fs.readFileSync('tests/track2/build-audit.json')),rows=[],errors=[];
fs.mkdirSync('tests/track2/art-review',{recursive:true});
try{for(const[key,info]of Object.entries(audit).filter(([k])=>k.startsWith('f1')&&k!=='f1mercedes'&&k!=='f12tdf')){
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push({key,error:e.message}));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto('http://127.0.0.1:8000/'+encodeURIComponent(info.file));await page.waitForFunction(()=>window.__Track2App?.f1ArtProfile&&window.__Track2App?.updateUi,null,{timeout:60000,polling:100});
 const row=await page.evaluate(async()=>{const a=window.__Track2App,s=a.state;document.getElementById('startBtn').click();s.started=s.ignition=true;a.selectCircuit('Silverstone Circuit');await a.prepareTrack('Silverstone Circuit');s.speedMps=60;s.rpm=9500;s.curGear=6;s.gearMode='G';s.distanceM=20;s.ersStore=.63;s.mguKPowerKw=142;a.updateUi();a.setView('cockpit');a.drawWorld();
  const el=id=>document.getElementById(id),click=action=>document.querySelector('[data-wheel-action="'+action+'"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));
  const values={gear:el('tachGearArt').textContent,speed:el('cabSpeedArt').textContent,energy:el('f1WheelEnergy').textContent};
  const strat=s.strat;click('strat');if(strat===s.strat)throw Error('strategy disconnected');click('neutral');if(s.gearMode!=='N')throw Error('neutral disconnected');
  const hold=document.querySelector('[data-wheel-action="override"]');hold.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));if(!s.keys.KeyV)throw Error('hold disconnected');hold.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',bubbles:true}));if(s.keys.KeyV)throw Error('hold stuck');
  const wheel=el('cabinWheelG').getBoundingClientRect(),view=el('cabinArt').getBoundingClientRect();if(wheel.left<view.left||wheel.right>view.right)throw Error('wheel clipped');
  const malformed=[...document.querySelectorAll('#cabinArt svg path,#exteriorArt svg path,#f1EngineDrawing svg path')].filter(p=>/NaN|undefined/.test(p.getAttribute('d'))).length;
  s.curGear=6;s.gearMode='G';a.updateUi();return{values,controls:document.querySelectorAll('[data-wheel-action]').length,malformed,expectedControls:a.f1ArtProfile.buttons.length+a.f1ArtProfile.rotaries.length+a.f1ArtProfile.rollers.length+2,pu:a.f1ArtProfile.pu};});
 assert.deepEqual(row.values,{gear:'6',speed:'216',energy:'63%'});assert.equal(row.malformed,0);assert.equal(row.controls,row.expectedControls);
 for(const view of ['drive','cockpit','exterior','engine']){await page.evaluate(v=>{const a=window.__Track2App;if(v==='engine'&&!a.state.engineCoverOpen)a.setToggle('engineCoverOpen');a.setView(v);a.updateUi();a.drawWorld();},view);await page.screenshot({path:'tests/track2/art-review/'+key+'-'+view+'.png',animations:'disabled'});}
 rows.push({key,...row});console.log('PASS',key);await page.close();
}}finally{await browser.close();}
fs.writeFileSync('tests/track2/art-review/results.json',JSON.stringify({rows,errors},null,2));assert.equal(errors.length,0,JSON.stringify(errors));
