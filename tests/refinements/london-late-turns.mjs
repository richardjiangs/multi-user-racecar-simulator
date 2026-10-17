import {createRequire} from 'node:module';import assert from 'node:assert/strict';import fs from 'node:fs';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'}),page=await browser.newPage();
try {
 await page.goto(process.env.LONDON_URL||'http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);
 await page.selectOption('#trackVersion','2');await page.evaluate(()=>__mucs.openPractice('tesla'));await page.waitForFunction(()=>__mucs.getSimApp()?.gps);
 const result=await page.evaluate(()=>{
  const a=__mucs.getSimApp(),n=a.cityNetwork,s=a.state;a.enterLondon();s.started=false;s.assist=true;n.destination('221b-baker');let maxJump=0,maxYaw=0,worst=null,count=0,changed=0,unstable=0;
  for(const r of n.roads)for(const dir of [-1,1]){
   if((dir>0?r.fwd:r.back)<=0)continue;
   for(const rem of [.01,1,5,15])for(const code of ['KeyA','KeyD']){
    s.ldn={road:r,dir,node:dir>0?r.A:r.B,next:dir>0?r.B:r.A};s.distanceM=r.len-rem;s.laneOffset=-2;s.headingRel=0;s.keys={};n.prepare();
    const p=n.playerPoint(),planned=s.ldn.netExit.link;s.keys[code]=true;n.prepare();const selected=s.ldn.netExit.link;
    if(selected!==planned)changed++;
    // Repeating preparation with no elapsed physics must retain the same exit.
    for(let i=0;i<3;i++){n.prepare();if(s.ldn.netExit.link!==selected)unstable++;}
    n.step();const q=n.playerPoint(),jump=Math.hypot(q.x-p.x,q.z-p.z),yaw=Math.abs(Math.atan2(Math.sin(q.psi-p.psi),Math.cos(q.psi-p.psi)));count++;maxYaw=Math.max(maxYaw,yaw);
    if(jump>maxJump){maxJump=jump;worst={road:r.name,dir,rem,code,planned:planned.road.name,chosen:selected.road.name,p,q};}
   }
  }
  return {count,changed,unstable,maxJump,maxYaw,worst};
 });
 assert.equal(result.count,2720);assert.ok(result.changed>500);assert.equal(result.unstable,0,JSON.stringify(result));assert.ok(result.maxJump<.001,JSON.stringify(result));assert.ok(result.maxYaw<.000001,JSON.stringify(result));
 fs.writeFileSync(process.env.LONDON_RESULTS||'tests/refinements/london-late-turns-results.json',JSON.stringify(result,null,2));console.log('PASS London late junction overrides',result);
}finally{await browser.close();}
