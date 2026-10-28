import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch();
const garage=process.argv.includes('--garage'),base=process.env.TEST_BASE_URL||'http://127.0.0.1:8000/';
try{for(const edition of['',' 2.0']){
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 let frame;if(garage){await page.goto(base);await page.waitForFunction(()=>window.__mucs);await page.selectOption('#trackVersion',edition?'2':'1');await page.evaluate(()=>__mucs.openPractice('roadster2'));await page.waitForFunction(()=>__mucs.getSimApp()?.roadsterReadInputs);frame=await (await page.$('#simFrame')).contentFrame();}else{await page.goto(base+encodeURIComponent('Tesla Roadster 2 simulator'+edition+'.html'));frame=page.mainFrame();}await frame.click('#startBtn');
 for(const control of['plain','trackpad','assist','testDriver'])for(const key of['ArrowLeft','ArrowRight']){
  await frame.evaluate(control=>{const a=RoadsterApp,s=a.state;a.selectCircuit('Tesla Development Grounds');a.roadsterAction('drive');s.assist=control==='assist';s.testDriver=control==='testDriver';s.trackpadSteering=control==='trackpad';s.touchActive=false;s.touchSteer=0;s.speedMps=5;},control);
  await frame.locator('#worldCanvas').click({position:{x:700,y:250}});
  await page.keyboard.down(key);await page.keyboard.down('w');
  const result=await frame.evaluate(()=>{const a=RoadsterApp,s=a.state,heading=s.roadster.yaw;for(let i=0;i<60;i++)a.updatePhysics(1/120);return{rocket:s.rocket,steer:s.steer,turn:Math.atan2(Math.sin(s.roadster.yaw-heading),Math.cos(s.roadster.yaw-heading))};});
  await page.keyboard.up('w');await page.keyboard.up(key);
  assert.equal(result.rocket,false);const sign=key==='ArrowRight'?1:-1;
  assert.ok(result.steer*sign>.8&&result.turn*sign>.15,`${edition||'1.0'} ${control} ${key} must steer with Rocket off: ${JSON.stringify(result)}`);
 }
 assert.deepEqual(errors,[]);console.log('PASS '+(garage?'garage ':'')+'Rocket-off ground arrows: both directions, normal, fullscreen trackpad, assist and test driver; Roadster '+(edition||'1.0'));await page.close();
}}finally{await browser.close();}
