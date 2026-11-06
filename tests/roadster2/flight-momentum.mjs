import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch(),reports=[];
try{for(const edition of(process.env.ROADSTER_TEST_FILE?[process.env.ROADSTER_TEST_FILE]:['',' 2.0'])){
 const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.addInitScript(()=>requestAnimationFrame=()=>0);
 const portable=!!process.env.ROADSTER_TEST_FILE;
 await p.goto(portable?pathToFileURL(edition).href:'http://127.0.0.1:8000/'+encodeURIComponent('Tesla Roadster 2 simulator'+edition+'.html'));
 if(portable)await p.waitForFunction(()=>window.__offlineApp,null,{polling:50,timeout:120000});
 const f=portable?await(await p.$('#simFrame')).contentFrame():p.mainFrame();
 await f.waitForFunction(()=>window.RoadsterApp?.roadsterAttitudeInfo,null,{polling:50});await f.click('#startBtn');
 const routes=await f.evaluate(()=>[...Object.keys(RoadsterApp.roadsterScenes),...(RoadsterApp.trackFrame?['Circuit de Monaco']:[])]);
 for(const route of routes){const report=await f.evaluate(async route=>{
  const a=RoadsterApp,s=a.state,dt=1/120;
  const setup=async(roll=0)=>{a.selectCircuit(route);await a.prepareTrack?.(route);a.roadsterAction('drive');a.toggleRocket();s.realMode=false;Object.assign(s.roadster,{x:0,z:1000,y:10000,alt:10000,airborne:true,hold:false,positionHold:false,throttleLever:1,vx:0,vy:0,vz:40,yaw:0,pitch:0,bodyAxes:null,roll,yoke:-roll*180/Math.PI});s.speedMps=40;};
  const cases=[['straight',{}],['up loops',{KeyW:true}],['down loops',{KeyS:true}],['inverted loops',{KeyW:true},Math.PI],['sideways loops',{KeyW:true},Math.PI/2],['roll only',{KeyD:true}],['mixed roll and pitch',{KeyD:true,KeyW:true}],['moving right turn',{ArrowRight:true}]];
  const out={route,cases:[]};
  for(const[name,keys,roll=0]of cases){await setup(roll);s.keys=keys;let minForward=40,maxSlip=0,maxNormal=0,minStep=Infinity,totalTurn=0,prevSpeed=40;const speeds=[];
   for(let i=0;i<45*120;i++){
    const before=a.roadsterAttitudeInfo().forward;a.updatePhysics(dt);const f=s.roadster,nose=a.roadsterAttitudeInfo().forward,v=[f.vx,f.vy,f.vz],actual=Math.hypot(...v),along=v.reduce((sum,x,k)=>sum+x*nose[k],0);
    const turn=Math.atan2(Math.hypot(...[before[1]*nose[2]-before[2]*nose[1],before[2]*nose[0]-before[0]*nose[2],before[0]*nose[1]-before[1]*nose[0]]),before.reduce((sum,x,k)=>sum+x*nose[k],0));
    totalTurn+=turn;maxNormal=Math.max(maxNormal,prevSpeed*turn/dt);minStep=Math.min(minStep,actual-prevSpeed);prevSpeed=actual;
    minForward=Math.min(minForward,along);maxSlip=Math.max(maxSlip,Math.hypot(...v.map((x,k)=>x-along*nose[k])));if(i%120===119)speeds.push(actual);
    if(!Number.isFinite(actual)||Math.abs(actual-s.speedMps)>1e-8)throw Error('Invalid displayed speed');
   }
   s.keys={};a.drawWorld();a.updateUi();out.cases.push({name,speeds,minForward,maxSlip,maxNormal,minStep,totalTurn});
  }
  // With no gas, pitch cannot invisibly redirect momentum or create thrust.
  await setup();s.realMode=true;s.roadster.gas=0;s.keys={KeyW:true,KeyD:true};const before=a.roadsterAttitudeInfo();a.updatePhysics(dt);out.empty={before,after:a.roadsterAttitudeInfo(),vx:s.roadster.vx,vy:s.roadster.vy,vz:s.roadster.vz,gas:s.roadster.gas};
  // Braking still reduces actual three-axis speed and leaves the held lever intact.
  await setup();s.keys={ArrowDown:true};for(let i=0;i<120;i++)a.updatePhysics(dt);out.brake={speed:s.speedMps,lever:s.roadster.throttleLever};
  s.keys={};return out;
 },route);
 const base=report.cases[0].speeds;
 for(const c of report.cases){assert.ok(c.minStep>=-1e-7,route+' full throttle must not oscillate '+JSON.stringify(c));assert.ok(c.minForward>0,route+' must not slide tail-first '+c.name);assert.ok(c.maxSlip<1e-7,'Thrust and trajectory must agree '+c.name);c.speeds.forEach((v,i)=>assert.ok(Math.abs(v-base[i])<1e-6,'Changing attitude cannot change the drag law '+c.name));if(c.name.includes('loops')){assert.ok(c.totalTurn>Math.PI*4,'Repeated complete loops remain possible');assert.ok(c.maxNormal<=36.001,'Pitch-path thrust is bounded');}if(c.name==='roll only')assert.ok(c.totalTurn<1e-6,'Roll alone cannot steer');}
 for(const axis of['right','up','forward'])assert.deepEqual(report.empty.after[axis],report.empty.before[axis]);assert.ok(report.empty.vy<0&&report.empty.vz<40);assert.equal(report.empty.gas,0);assert.ok(report.brake.speed<30&&report.brake.lever===1);assert.deepEqual(errors,[]);
 reports.push({edition:edition||'1.0',...report});console.log('PASS flight momentum:',edition||'1.0',route,'full-throttle loops, rolls, turns, brakes and empty gas');
 }
 await p.close();
}}finally{fs.writeFileSync('/tmp/roadster-flight-momentum-results.json',JSON.stringify(reports,null,2));await browser.close();}
