import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'}),page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(process.env.LONDON_URL||'http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);await page.selectOption('#trackVersion','2');await page.evaluate(()=>__mucs.openPractice('spectre'));await page.waitForFunction(()=>__mucs.getSimApp()?.cityNetwork);
 const result=await page.evaluate(()=>{const a=__mucs.getSimApp(),s=a.state,n=a.cityNetwork;s.started=false;const routes=[];
  // The former distance-only planner immediately reversed these approaches.
  // An ordinary forward detour now avoids that instruction; dead ends must
  // still be able to request a necessary U-turn.
  for(const [node,road] of [['oxfordcirc','Regent Street (A4201)'],['whitehall','Whitehall, Parliament Street'],['baker','Euston Road (A501)'],['trafalgar','Charing Cross']]){a.enterLondon(node,road);s.distanceM=s.ldn.road.len*.5;n.destination('221b-baker');routes.push({road,next:n.navigation().turns[0],remaining:n.navigation().remaining});}
  return routes;
 });for(const r of result.slice(0,3)){assert.notEqual(r.next.kind,'uturn',JSON.stringify(r));assert.ok(r.remaining>0);}assert.equal(result[3].next.kind,'uturn');assert.deepEqual(errors,[]);console.log('PASS forward detours and necessary dead-end reversal',JSON.stringify(result));
}finally{await browser.close();}
