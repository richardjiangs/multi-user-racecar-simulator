import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const page=await browser.newPage();
try {
 await page.goto(process.env.LONDON_URL||'http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);
 await page.selectOption('#trackVersion','2');await page.evaluate(()=>__mucs.openPractice('tesla'));await page.waitForFunction(()=>__mucs.getSimApp()?.gps);
 const result=await page.evaluate(async()=>{
  const a=__mucs.getSimApp(),s=a.state;
  a.selectCircuit(Object.keys(a.CIRCUITS).find(n=>/^Stage 7/.test(n)));await a.prepareTrack(s.route.name);const rally=a.trackModel().terrain;
  s.started=false;a.setView('drive');a.gps.setMode('line');a.gps.render(performance.now()+100);
  a.enterLondon();a.gps.render(performance.now()+1000);
  const city={route:s.route.name,env:s.route.env,model:!!a.trackModel(),gps:a.gps.inspect().route,mode:a.gps.mode,rivals:s.rivals.length};
  // Left and right approaches to a U-turn straddle -pi/+pi. Both must
  // retain access to the same legal return road with navigation selected.
  const returns=[];
  for(const side of [-1,1]){
   a.enterLondon('baker','Baker Street (A41)');s.distanceM=s.ldn.road.len-60;s.headingRel=side*Math.PI;s.keys={[side<0?'KeyA':'KeyD']:true};
   a.cityNetwork.destination('221b-baker');a.cityNetwork.prepare();returns.push(s.ldn.netExit.link.road===s.ldn.road&&s.ldn.netExit.link.out===-s.ldn.dir);
  }
  s.keys={};a.selectCircuit('Circuit de Monaco');await a.prepareTrack('Circuit de Monaco');a.gps.render(performance.now()+2000);
  return {rally,city,returns,after:{route:s.route.name,mode:a.gps.mode,track:!!a.trackModel(),grid:s.raceGrid}};
 });
 assert.equal(result.rally,'rally');assert.equal(result.city.model,false);assert.equal(result.city.env,'city');assert.equal(result.city.mode,'dashboard');assert.equal(result.city.rivals,0);
 assert.deepEqual(result.returns,[true,true]);assert.equal(result.after.track,true);assert.equal(result.after.mode,'line');
 console.log('PASS Dakar → London → Monaco; both U-turn directions',result);
} finally {await browser.close();}
