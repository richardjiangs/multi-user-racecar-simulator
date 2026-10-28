import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright'),browser=await chromium.launch();
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8000/';
try {
 for(const version of ['', ' 2.0']) {
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+encodeURIComponent('Tesla Roadster 2 simulator'+version+'.html'));
  await page.click('#startBtn');
  const report=await page.evaluate(()=>{
   const app=RoadsterApp,s=app.state,r={};
   const step=seconds=>{for(let i=0;i<seconds*120;i++){s.time+=1/120;app.updatePhysics(1/120);}};
   const reset=()=>{app.selectCircuit('JFK Airport — Runway 13R/31L');app.roadsterAction('drive');};
   reset();app.toggleRocket();s.keys.KeyP=true;step(2);s.keys={};
   s.roadster.throttleLever=.8;step(3);r.forward=s.speedMps;
   app.roadsterAction('hover');const f=s.roadster,anchor={x:f.x,z:f.z};step(25);
   r.holdError=Math.hypot(f.x-anchor.x,f.z-anchor.z);r.holdSpeed=Math.hypot(f.vx,f.vz);r.lever=f.throttleLever;
   r.spins=[];
   for(const key of ['KeyI','KeyO']) {
    s.keys[key]=true;let total=0,maxDrift=0;
    for(let i=0;i<720;i++) {
     const yaw=f.yaw;app.updatePhysics(1/120);
     total+=Math.atan2(Math.sin(f.yaw-yaw),Math.cos(f.yaw-yaw));
     maxDrift=Math.max(maxDrift,Math.hypot(f.x-anchor.x,f.z-anchor.z));
    }
    s.keys={};r.spins.push({key,total,maxDrift,pitch:f.pitch});
   }
   const stationaryYaw=f.yaw;s.keys.ArrowRight=true;step(1);s.keys={};
   r.stationarySteeringDelta=f.yaw-stationaryYaw;
   s.roadster.throttleLever=.8;step(3);s.keys.ArrowRight=true;let movingTurn=0;
   for(let i=0;i<360;i++) {
    const yaw=f.yaw;app.updatePhysics(1/120);
    movingTurn+=Math.atan2(Math.sin(f.yaw-yaw),Math.cos(f.yaw-yaw));
   }
   r.movingTurn=movingTurn;s.keys={};
   reset();s.speedMps=4.5;s.padThrottle=.02;s.keys.KeyD=true;
   let groundTurn=0,minX=0,maxX=0;
   for(let i=0;i<420;i++) {
    const yaw=s.roadster.yaw;app.updatePhysics(1/120);
    groundTurn+=Math.atan2(Math.sin(s.roadster.yaw-yaw),Math.cos(s.roadster.yaw-yaw));
    minX=Math.min(minX,s.roadster.x);maxX=Math.max(maxX,s.roadster.x);
   }
   r.groundUTurn={angle:groundTurn,width:maxX-minX,steering:app.roadsterTurning};s.keys={};
   app.drawWorld();r.aircraft=app.roadsterAircraft();
   const poses=r.aircraft.poses.filter(p=>p.flying);s.time+=.1;
   const next=app.roadsterAircraft().poses;
   r.aircraftHeadingErrors=poses.map(p=>{
    const q=next.find(q=>q.id===p.id),bearing=Math.atan2(q.x-p.x,q.z-p.z);
    return Math.abs(Math.atan2(Math.sin(bearing-p.yaw),Math.cos(bearing-p.yaw)));
   });
   s.time+=9.9;const moved=app.roadsterAircraft().poses.find(p=>p.id===poses[0].id);
   r.aircraftTravel=Math.hypot(moved.x-poses[0].x,moved.z-poses[0].z);
   r.gl=app.roadsterWorldInfo().webglError;return r;
  });
  assert.ok(report.forward>10);
  assert.ok(report.holdError<.05&&report.holdSpeed<.02,JSON.stringify(report));assert.equal(report.lever,0);
  for(const spin of report.spins) {
   assert.ok(Math.abs(spin.total)>2*Math.PI);assert.ok(spin.maxDrift<.05);assert.ok(Math.abs(spin.pitch)<.001);
  }
  assert.ok(report.spins[0].total<0&&report.spins[1].total>0);
  assert.ok(Math.abs(report.stationarySteeringDelta)<.001,'Normal steering must not spin at rest');
  assert.ok(report.movingTurn>Math.PI,'Moving U-turn takes under three seconds at manoeuvring speed');
  assert.ok(report.groundUTurn.angle>Math.PI&&report.groundUTurn.width<12);
  assert.ok(report.aircraft.vertices>10000&&report.aircraft.gearVertices>1000);
  assert.ok(report.aircraftTravel>300);assert.ok(report.aircraftHeadingErrors.every(e=>e<.005),'Aircraft point along their flight paths');
  assert.equal(report.gl,0);assert.deepEqual(errors,[]);
  console.log('PASS Roadster '+(version||'1.0')+': fixed hover, both 360° spins without drift, moving/ground U-turns, detailed aircraft moving nose-first',JSON.stringify({holdError:report.holdError,spins:report.spins,turn:report.movingTurn,ground:report.groundUTurn,aircraftVertices:report.aircraft.vertices}));
  await page.close();
 }
} finally { await browser.close(); }
