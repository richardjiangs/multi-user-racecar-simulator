import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],results=[];
page.on('pageerror',e=>{errors.push(e.stack);console.error(e.message);});
const run=(fn,arg)=>page.evaluate(({fn,arg})=>(0,eval)('('+fn+')')(__mucs.getSimApp(),arg),{fn:String(fn),arg});
try{
 await page.goto('http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);
 for(const version of ['1','2'])for(const key of ['phantom','spectre']){
  await page.selectOption('#trackVersion',version);await page.evaluate(k=>__mucs.openPractice(k),key);await page.waitForFunction(()=>__mucs.getSimApp()?.gps,null,{timeout:60000});
  const f=page.frames().find(f=>f!==page.mainFrame());await f.locator('#startBtn').click();await page.waitForTimeout(300);
  await run(a=>{a.setView('drive');a.state.started=false;a.el.keyOverlay?.classList.add('hide');a.enterLondon();a.gps.setMode('dashboard');a.gps.setPreset(1);});
  await f.selectOption('#gpsDestination','221b-baker');
  const routing=await run(a=>{a.cityNetwork.prepare();a.gps.render(performance.now()+1000);return a.cityNetwork.inspect();});assert.ok(routing.destination.includes('221B'));assert.ok(routing.routeLinks.some(n=>n.includes('Baker Street')));
  await run((a,key)=>{a.setView(key==='phantom'?'computer':'circuit');a.drawMap();},key);assert.ok(await f.locator('#cityDestination').isVisible());await f.selectOption('#cityDestination','221b-baker');
  const pin=await run(a=>{a.drawMap();const p=a.cityNetwork.locations.find(p=>p.id==='221b-baker');return a.cityNetwork.mapProject(p);});const mapBox=await f.locator('#mapCanvas').boundingBox();await page.mouse.move(mapBox.x+pin.x,mapBox.y+pin.y);for(let i=0;i<6;i++)await page.mouse.wheel(0,-150);await page.waitForTimeout(100);assert.ok((await run(a=>a.cityNetwork.inspect().mapView.zoom))>5);await f.selectOption('#cityDestination','');const pinAfter=await run(a=>{a.drawMap();return a.cityNetwork.mapProject(a.cityNetwork.locations.find(p=>p.id==='221b-baker'));});await page.mouse.click(mapBox.x+pinAfter.x,mapBox.y+pinAfter.y);assert.ok((await run(a=>a.cityNetwork.inspect().destination)).includes('221B'));

  await run(a=>{a.setView('drive');a.gps.setMode('dashboard');});
  const geometry=await run(a=>{
   const n=a.cityNetwork,s=a.state,ids=n.traffic.map(c=>c.id),hash=JSON.stringify(n.primitives);s.assist=true;s.headingRel=0;s.laneOffset=-2;
   // Cross a road's endpoint in world coordinates and reverse the same
   // displacement. An intended turn cannot rotate or relocate the camera.
   let maxJump=0,maxYaw=0,maxReverse=0,turns=0;
   for(const road of n.roads.slice(0,25)){
    s.ldn={road,dir:1,node:road.A,next:road.B};s.distanceM=road.len-.001;s.headingRel=0;s.laneOffset=-2;n.prepare();const p=n.playerPoint();s.speedMps=1;n.integrate(.002,0);n.step();const q=n.playerPoint();maxJump=Math.max(maxJump,Math.hypot(q.x-p.x,q.z-p.z));maxYaw=Math.max(maxYaw,Math.abs(Math.atan2(Math.sin(q.psi-p.psi),Math.cos(q.psi-p.psi))));turns++;
    s.speedMps=-1;n.integrate(.002,0);n.step();const r=n.playerPoint();maxReverse=Math.max(maxReverse,Math.hypot(r.x-p.x,r.z-p.z));
   }
   // World-space velocity must point along the drawn car heading, including oncoming traffic and turns.
   let worstDot=1,maxStep=0,worst=null;for(let i=0;i<600;i++){const poses=n.traffic.map(c=>n.trafficPose(c));s.routeTime+=1/30;n.trafficStep(1/30);n.traffic.forEach((c,j)=>{const p=poses[j],q=n.trafficPose(c),dx=q.x-p.x,dz=q.z-p.z,len=Math.hypot(dx,dz);if(len>.0001){const dot=(dx*Math.sin(q.psi)+dz*Math.cos(q.psi))/len;if(dot<worstDot){worstDot=dot;worst={id:c.id,road:c.road.name,roadLength:c.road.len,width:c.road.w,d:c.d,speed:c.speed,entry:c.entry?.turn,exit:c.exit?.curve.turn,p,q};}maxStep=Math.max(maxStep,len);}});}
   return {maxJump,maxYaw,maxReverse,turns,worstDot,worst,maxStep,sameGeometry:hash===JSON.stringify(n.primitives),sameActors:JSON.stringify(ids)===JSON.stringify(n.traffic.map(c=>c.id)),count:n.traffic.length};
  });
  assert.ok(geometry.maxJump<.01,JSON.stringify(geometry));assert.ok(geometry.maxYaw<.001,JSON.stringify(geometry));assert.ok(geometry.maxReverse<.01,JSON.stringify(geometry));assert.ok(geometry.worstDot>.96,JSON.stringify(geometry));assert.ok(geometry.maxStep<1,JSON.stringify(geometry));assert.ok(geometry.sameGeometry&&geometry.sameActors);assert.ok(geometry.turns>5);
  await run(a=>{a.enterLondon('baker','Baker Street (A41)');a.state.distanceM=30;a.state.laneOffset=-2;a.state.headingRel=0;a.cityNetwork.prepare();a.cityNetwork.trafficStep(0);a.gps.setPreset(2);(a.drawWorld||a.drawCity)();});await page.screenshot({path:'/tmp/'+key+'-london-'+version+'.png'});
  const timing=await run(a=>{const t=performance.now();for(let i=0;i<20;i++)(a.drawWorld||a.drawCity)();return (performance.now()-t)/20;});assert.ok(timing<100,'London render milliseconds: '+timing);
  for(const heading of [Math.PI/2,Math.PI]){await run((a,h)=>{a.state.headingRel=h;(a.drawWorld||a.drawCity)();},heading);}
  await run(a=>{a.gps.setMode('mirror');(a.drawWorld||a.drawCity)();});
  const arrival=await run(a=>{const s=a.state,n=a.cityNetwork;n.destination('221b-baker');a.enterLondon('baker','Baker Street (A41)');n.prepare();const p=n.destinationPoint;s.distanceM=p.d-7;s.speedMps=.2;s.headingRel=0;s.laneOffset=-2;s.chauffeur=false;s.testDriver=false;const manual=n.arrivalSpeedLimit();s.testDriver=true;const cap=n.arrivalSpeedLimit();n.step();return{manual:manual===Infinity,cap,arrived:n.inspect().arrived,stoppedTarget:n.arrivalSpeedLimit()};});assert.ok(arrival.manual);assert.ok(arrival.cap<3);assert.ok(arrival.arrived);assert.equal(arrival.stoppedTarget,0);
  results.push({key,version,routing:{...routing,routePoints:undefined,routePointCount:routing.routePoints.length},geometry,renderMs:timing,arrival});console.log('PASS',key,version,geometry);await page.evaluate(()=>__mucs.backToGarage());
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('tests/refinements/london-results.json',JSON.stringify({results,errors},null,2));
}finally{await browser.close();}
