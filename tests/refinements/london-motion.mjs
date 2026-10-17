import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],results=[];
page.on('pageerror',e=>{errors.push(e.stack);console.error(e.stack);});
try{
 await page.goto(process.env.LONDON_URL||'http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);
 for(const version of ['1','2'])for(const key of ['tesla','taycan','m5','evo','project8','phantom','spectre']){
  await page.selectOption('#trackVersion',version);await page.evaluate(k=>__mucs.openPractice(k),key);await page.waitForFunction(()=>__mucs.getSimApp()?.cityNetwork&&__mucs.getSimApp()?.gps,null,{timeout:60000});
  const frame=page.frames().find(f=>f!==page.mainFrame());await frame.locator('#startBtn').click();
  const result=await page.evaluate(({key,version})=>{
   const a=__mucs.getSimApp(),n=a.cityNetwork,s=a.state,A=x=>Math.atan2(Math.sin(x),Math.cos(x));a.enterLondon();s.started=false;s.keys={};s.assist=false;s.laneAssist=false;s.testDriver=false;s.chauffeur=false;s.adaptiveCruise=false;s.steer=0;n.destination('221b-baker');
   const initial=n.navigation();let cases=0,maxError=0,maxYawError=0,handoffs=0,overlapping=0,failures=[];
   const put=(r,dir,p)=>{const node=dir>0?r.A:r.B,psi=r.brg+(dir<0?Math.PI:0),dx=p.x-node.e*1000,dz=p.z-node.n*1000;s.ldn={road:r,dir,node,next:dir>0?r.B:r.A};s.distanceM=dx*Math.sin(psi)+dz*Math.cos(psi);s.laneOffset=dx*Math.cos(psi)-dz*Math.sin(psi);s.headingRel=A(p.psi-psi);};
   // Every connected junction: different lane positions, no navigation snap,
   // and real world headings into every geometrically distinct outgoing road.
   for(const r of n.roads)for(const dir of [-1,1]){
    if((dir>0?r.fwd:r.back)<=0)continue;const node=dir>0?r.B:r.A;
    for(const link of node.roads){if(link.road===r)continue;const out=link.out,psi=link.road.brg+(out<0?Math.PI:0);
     if(node.roads.some(l=>l!==link&&l.road!==r&&Math.abs(A(l.road.brg+(l.out<0?Math.PI:0)-psi))<.15))continue;
     for(const lane of [-.25,0,.25]){const off=n.width(link.road)*lane,p={x:node.e*1000+Math.cos(psi)*off,z:node.n*1000-Math.sin(psi)*off,psi};put(r,dir,p);s.speedMps=30;n.prepare();
      const travel=Math.min(30,link.road.len*.65);for(let i=0;i<120;i++)n.integrate(travel/30/120,0);n.step();const q=n.playerPoint(),err=Math.hypot(q.x-p.x-travel*Math.sin(psi),q.z-p.z-travel*Math.cos(psi));maxError=Math.max(maxError,err);maxYawError=Math.max(maxYawError,Math.abs(A(q.psi-psi)));cases++;if(s.ldn.road===link.road&&s.ldn.dir===out)handoffs++;else if(Math.abs(A(s.ldn.road.brg+(s.ldn.dir<0?Math.PI:0)-psi))<1e-8&&Math.abs(s.laneOffset-off)<1e-6)overlapping++;else if(failures.length<8)failures.push({from:r.name,to:link.road.name,actual:s.ldn.road.name,lane});
     }
    }
   }
   // S-shaped motion and a late steering change retain physical arc length at
   // 354 km/h as well as city speeds. Navigation cannot change yaw or speed.
   let maxArcError=0;for(const speed of [5,15,354/3.6]){a.enterLondon();s.distanceM=s.ldn.road.len-10;s.laneOffset=0;s.headingRel=0;s.speedMps=speed;let p=n.playerPoint();for(let i=0;i<240;i++){const yawRate=i<80?.25:i<160?-.5:.25,dt=1/120,yaw=yawRate*dt,travel=speed*dt*Math.sin(yaw/2)/(yaw/2),expected={x:p.x+Math.sin(p.psi+yaw/2)*travel,z:p.z+Math.cos(p.psi+yaw/2)*travel};n.integrate(dt,yawRate);n.step();const q=n.playerPoint();maxArcError=Math.max(maxArcError,Math.hypot(q.x-expected.x,q.z-expected.z));if(s.speedMps!==speed)throw Error('Navigation changed speed');p=q;}}
   // Full powertrain updates, wrong-facing at an intersection. Render and map
   // must keep running, with no race-line wall clamp or forced zero speed.
   a.enterLondon();Object.assign(s,{started:true,ignition:true,gearMode:key==='phantom'?'D':'G',curGear:1,autoGear:1,speedMps:12,steer:0,assist:false,laneAssist:false,testDriver:false,chauffeur:false,adaptiveCruise:false,keys:{KeyW:true},harness:true,beltLatched:true,distanceM:s.ldn.road.len-3,laneOffset:0,headingRel:Math.PI/2});const r=n.roads.find(r=>r.B.roads.some(l=>l.road!==r&&l.road.len>200&&Math.abs(A(l.road.brg+(l.out<0?Math.PI:0)-r.brg))>.6&&Math.abs(A(l.road.brg+(l.out<0?Math.PI:0)-r.brg))<2.4)),link=r.B.roads.find(l=>l.road!==r&&l.road.len>200&&Math.abs(A(l.road.brg+(l.out<0?Math.PI:0)-r.brg))>.6&&Math.abs(A(l.road.brg+(l.out<0?Math.PI:0)-r.brg))<2.4),psi=link.road.brg+(link.out<0?Math.PI:0);put(r,1,{x:r.B.e*1000,z:r.B.n*1000,psi});n.prepare();const p=n.playerPoint();let maxPhysicalStep=0;
   for(let i=0;i<240;i++){const p=n.playerPoint();a.updatePhysics(1/120);const q=n.playerPoint();maxPhysicalStep=Math.max(maxPhysicalStep,Math.hypot(q.x-p.x,q.z-p.z));}const q=n.playerPoint(),physics={distance:Math.hypot(q.x-p.x,q.z-p.z),speed:s.speedMps,maxPhysicalStep,onRoad:n.onRoad(),road:s.ldn.road.name};s.started=false;s.keys={};
   a.enterLondon();s.distanceM=s.ldn.road.len-30;s.speedMps=20;s.headingRel=0;n.destination('221b-baker');a.setView('drive');a.el.keyOverlay?.classList.add('hide');a.gps.render(performance.now()+500);a.gps.setMode('ar');a.gps.render(performance.now()+1000);const ar=a.gps.inspect();(a.drawWorld||a.drawCity)();
   return{key,version,cases,handoffs,overlapping,failures,maxError,maxYawError,maxArcError,physics,initial,ar:ar.arManeuver,revision:ar.arRouteRevision};
  },{key,version});
  assert.ok(result.cases>1500);assert.equal(result.handoffs+result.overlapping,result.cases,JSON.stringify(result.failures));assert.ok(result.maxError<1e-6&&result.maxYawError<1e-8&&result.maxArcError<1e-7,JSON.stringify(result));assert.ok(result.physics.distance>15&&result.physics.speed>5&&result.physics.maxPhysicalStep<1&&result.physics.onRoad,JSON.stringify(result.physics));assert.ok(result.ar&&result.ar.y<450);assert.notEqual(result.initial.turns[0].kind,'uturn');
  if(key==='spectre'&&version==='2')await page.screenshot({path:'/tmp/london-turn-arrow.png'});
  results.push(result);console.log('PASS',key,version,result.cases,'junction approaches, error',result.maxError,'physics',result.physics);await page.evaluate(()=>__mucs.backToGarage());
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(process.env.LONDON_RESULTS||'tests/refinements/london-motion-results.json',JSON.stringify({results,errors},null,2));
}finally{await browser.close();}
