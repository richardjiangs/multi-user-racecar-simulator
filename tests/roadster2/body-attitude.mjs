import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire('/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch(),report=[];
const close=(a,b,label,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,label+': '+a+' != '+b);
const vecClose=(a,b,label,tol=1e-8)=>a.forEach((v,i)=>close(v,b[i],label+' '+i,tol));
try{
 const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],network=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>window.requestAnimationFrame=()=>0);await p.goto((process.env.TEST_BASE_URL||'http://127.0.0.1:8000/')+'Tesla%20Roadster%202%20simulator%202.0.html');await p.waitForFunction(()=>window.RoadsterApp?.roadsterAttitudeInfo);await p.click('#startBtn');
 const step=sec=>p.evaluate(sec=>{const a=RoadsterApp;for(let i=0;i<Math.round(sec*120);i++){a.state.time+=1/120;a.updatePhysics(1/120);}a.updateUi();a.drawWorld();},sec);
 const state=()=>p.evaluate(()=>({f:{...RoadsterApp.state.roadster},axes:RoadsterApp.roadsterAttitudeInfo()}));
 const hold=async(key,sec)=>{await p.keyboard.down(key);await step(sec);await p.keyboard.up(key);};
 async function setup(name='JFK Airport — Runway 13R/31L'){await p.evaluate(async name=>{const a=RoadsterApp;a.selectCircuit(name);await a.prepareTrack(name);a.roadsterAction('drive');a.toggleRocket();const f=a.state.roadster;Object.assign(f,{x:0,y:1000,z:1000,alt:1000,airborne:true,hold:true,holdY:1000,positionHold:true,holdX:0,holdZ:1000,throttleLever:0,roll:0,pitch:0,yaw:0,yoke:0,vx:0,vy:0,vz:0});},name);await p.locator('#worldCanvas').click({position:{x:700,y:250}});}
 for(const route of['JFK Airport — Runway 13R/31L','Circuit de Monaco']){
  for(const deg of[0,90,180,270,720])for(const key of['w','s']){
   await setup(route);if(deg)await hold('d',deg/90);const before=await state();await hold(key,1);const after=await state(),theta=(key==='w'?1:-1)*.75;
   const expected=before.axes.forward.map((v,i)=>v*Math.cos(theta)+before.axes.up[i]*Math.sin(theta));vecClose(after.axes.forward,expected,route+' '+deg+' '+key+' body-relative nose');vecClose(after.axes.right,before.axes.right,'Pitch about fixed body-right axis');close(after.f.yoke,deg,'Yoke setting retained');
   if(deg===180)assert.ok(key==='w'?after.axes.forward[1]<-.6:after.axes.forward[1]>.6,'Inverted pitch direction');if(deg===90||deg===270)close(after.axes.forward[1],0,'Sideways pitch must not add world altitude');
   // Free throttle must accelerate in the exact direction of the rotated nose.
   await p.evaluate(()=>{const s=RoadsterApp.state,f=s.roadster;f.vx=f.vy=f.vz=0;f.hold=false;f.positionHold=false;f.throttleLever=1;});await step(1/120);const thrust=await state();vecClose([thrust.f.vx*120,thrust.f.vy*120,thrust.f.vz*120],after.axes.forward.map(v=>v*7),'Body-directed rear thrust');
   report.push({route,bank:deg,key,nose:after.axes.forward});
  }
 }
 // Multiple mixed-axis loops: orthonormal axes, coherent Euler output and no gimbal lock.
 await setup();for(let n=0;n<30;n++){await p.keyboard.down(n%2?'a':'d');await p.keyboard.down(n%3?'w':'s');await step(.4);await p.keyboard.up(n%2?'a':'d');await p.keyboard.up(n%3?'w':'s');const q=await state(),v=[q.axes.right,q.axes.up,q.axes.forward];for(let i=0;i<3;i++){close(Math.hypot(...v[i]),1,'Unit body axis');for(let j=0;j<i;j++)close(v[i].reduce((s,x,k)=>s+x*v[j][k],0),0,'Perpendicular axes');}
 const {yaw:y,pitch:pi,roll:r}=q.f;vecClose(v[2],[Math.sin(y)*Math.cos(pi),Math.sin(pi),Math.cos(y)*Math.cos(pi)],'Camera and physics forward');vecClose(v[0],[Math.cos(y)*Math.cos(r)-Math.sin(y)*Math.sin(pi)*Math.sin(r),Math.cos(pi)*Math.sin(r),-Math.sin(y)*Math.cos(r)-Math.cos(y)*Math.sin(pi)*Math.sin(r)],'Camera and physics right');}
 // Release holds the entire attitude; I/O changes only earth heading and keeps its point.
 await p.keyboard.press('f');await step(10);let q=await state();close(q.f.yoke,0,'F centers yoke');vecClose(q.axes.up,[0,1,0],'F levels car');await hold('d',2);q=await state();await step(2);let q2=await state();vecClose(q2.axes.forward,q.axes.forward,'Release keeps nose');vecClose(q2.axes.up,q.axes.up,'Release keeps bank');await hold('o',2);q2=await state();close(q2.f.y,q.f.y,'I/O height');close(q2.axes.up[1],q.axes.up[1],'I/O preserves bank');close(q2.f.yoke,q.f.yoke,'I/O preserves yoke');
 // Capture the inverted cockpit and then its true inverted W nose-down view.
 await setup();await hold('d',2);await p.locator('#rsHelp summary').click();await p.screenshot({path:'/tmp/roadster-inverted-before-pitch.png'});await hold('w',1);await p.screenshot({path:'/tmp/roadster-inverted-body-pitch.png'});
 // Eye is rigidly attached to the cabin and projection agrees with that same eye.
 const a=await state();const projected=await p.evaluate(()=>{const a=RoadsterApp,b=a.roadsterAttitudeInfo(),e=b.eye;return a.projectRoadsterPoint({x:e.x+b.forward[0]*100,y:e.y+b.forward[1]*100,z:e.z+b.forward[2]*100});});close(projected.x,720,'Projected nose at viewport center');close(projected.y,900*.43,'Projected nose at horizon');assert.ok(a.axes.eye.y<a.f.y+.55,'Inverted eye lies below the roll center');
 assert.deepEqual(errors,[]);fs.writeFileSync('/tmp/roadster-body-attitude-report.json',JSON.stringify({report,errors,network},null,2));console.log('PASS body-frame pitch at 0/90/180/270/720 degrees on JFK and Monaco; real thrust follows nose; 30 mixed loops; release/F/I-O; matching camera/projection.');
}finally{await browser.close();}
