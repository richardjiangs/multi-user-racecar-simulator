import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'}),page=await browser.newPage(),results=[];
await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
try{
 await page.goto('http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs,null,{polling:100});
 for(const version of ['1','2']){
  await page.selectOption('#trackVersion',version);await page.evaluate(()=>__mucs.openPractice('porsche919'));await page.waitForFunction(()=>__mucs.getSimApp()?.gps,null,{polling:100});
  const result=await page.evaluate(()=>{
   const a=__mucs.getSimApp(),s=a.state,dt=1/120; a.resetCar();a.setMode('race');a.setGear('G',7);
   Object.assign(s,{started:true,ignition:true,harness:true,assist:false,laneAssist:false,testDriver:false,adaptiveCruise:false,speedMps:290/3.6,energyMode:1,realMode:false,hybridEnergy:0,hybridLapUsedMJ:8,rivals:[],raceGrid:false,pitLimiter:false,fcy:false,sail:false,throttle:1,brake:0});s.keys={KeyW:true};s.route.active=false;
   const samples=[];for(let i=0;i<120*150;i++){a.updatePhysics(dt);s.time+=dt;if(i%1200===1199)samples.push({second:(i+1)/120,speed:s.speedMps*3.6,mgu:s.mguPowerKw,soc:s.hybridEnergy});}
   s.realMode=true;s.hybridEnergy=0;s.hybridLapUsedMJ=8;const exhausted=a.hybridStep(dt,true);s.hybridEnergy=75;s.hybridLapUsedMJ=0;const charged=a.hybridStep(dt,true),remaining=s.hybridEnergy;
   s.hybridEnergy=75;s.hybridLapUsedMJ=8;const lapSpent=a.hybridStep(dt,true);
   s.realMode=false;s.brake=1;const braking=a.hybridStep(dt,true);s.brake=0;s.sail=true;const sailing=a.hybridStep(dt,true);s.sail=false;s.pitLimiter=true;const pit=a.hybridStep(dt,true);
   s.started=false;s.keys={};return{samples,exhausted,charged,remaining,lapSpent,braking,sailing,pit};
  });
  for(const sample of result.samples.slice(3)){assert.ok(sample.speed>=334.8&&sample.speed<=334.91,JSON.stringify(sample));assert.ok(sample.mgu>290,JSON.stringify(sample));}assert.equal(result.exhausted,0);assert.equal(result.lapSpent,0);assert.ok(result.charged>290&&result.remaining<75);assert.equal(result.braking,0);assert.equal(result.sailing,0);assert.equal(result.pit,0);results.push({version,...result});await page.evaluate(()=>__mucs.backToGarage());
 }
 fs.writeFileSync('tests/refinements/porsche919-boost-results.json',JSON.stringify(results,null,2));console.log('PASS 919: 150-second full-throttle runs sustain 334.9 km/h in both track versions; Real Mode battery/lap limits and brake/pit/sail gates preserved.');
}finally{await browser.close();}
