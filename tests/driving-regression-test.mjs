// User-reported regressions: stopped prototype rims, obstructed driving view, draining Normal F1 ERS.
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync,readdirSync} from 'node:fs';
const {chromium}=await import(process.env.CODEX_NODE_MODULES?pathToFileURL(resolve(process.env.CODEX_NODE_MODULES,'playwright/index.mjs')).href:'playwright');
const root=resolve(import.meta.dirname,'..'),out=process.env.VERIFICATION_DIR;
if(out)mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const reports=[];
async function open(file,name,viewport={width:1440,height:1000}){
 const page=await browser.newPage({viewport});
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;Math.random=()=>.5;});
 await page.goto(pathToFileURL(resolve(root,file+' simulator.html')).href);
 await page.waitForFunction(n=>!!window[n]?.updatePhysics,name);
 await page.evaluate(n=>{const a=window[n];a.el.keyOverlay.style.display='none';a.state.started=true;a.state.ignition=true;a.state.rivals=[];a.state.raceGrid=false;a.state.toastTimer=0;a.el.toast.classList.remove('show');},name);
 return page;
}
try{
 for(const [file,name,centres,direction] of [
  ['Porsche 919 Hybrid','Porsche919App',[[242,263],[811,263]],-1],
  ['Ferrari 499P','Ferrari499PApp',[[237,265],[789,265]],1]]){
  const page=await open(file,name);
  const result=await page.evaluate(async({name,centres,direction})=>{
   const a=window[name],s=a.state;a.setView('exterior');a.setGear('N');
   const paint=async()=>{const svg=a.el.exteriorArt.querySelector('svg'),img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));await img.decode();const c=document.createElement('canvas');c.width=1000;c.height=400;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,1000,400);return centres.map(([x,y])=>[...ctx.getImageData(x-45,y-45,90,90).data]);};
   s.wheelRotation=0;a.updateUi();const still=await paint();
   s.speedMps=20;a.updatePhysics(1/120);a.updateUi();const forwardAngle=s.wheelRotation,forward=await paint();
   const transforms=[...a.el.exteriorArt.querySelectorAll('[data-wheel-spin]')].map(g=>g.getAttribute('transform'));
   const changed=forward.map((pixels,i)=>pixels.reduce((n,v,j)=>n+(v!==still[i][j]),0));
   s.speedMps=0;a.setGear('R');s.speedMps=-20;a.updatePhysics(1/120);a.updateUi();const reverseAngle=s.wheelRotation;
   s.speedMps=0;a.setGear('N');s.throttle=0;s.keys.KeyW=false;a.updateUi();const stop0=await paint();
   for(let i=0;i<120;i++)a.updatePhysics(1/120);a.updateUi();const stop1=await paint();
   return {changed,forwardAngle,reverseAngle,transforms,stationary:JSON.stringify(stop0)===JSON.stringify(stop1),expected:`rotate(${forwardAngle*direction})`};
  },{name,centres,direction});
  assert(result.changed.every(n=>n>200),file+' both axle drawings must actually change pixels');
  assert(result.transforms.every(v=>v===result.expected));assert(result.reverseAngle<result.forwardAngle);assert(result.stationary);
  if(out)await page.screenshot({path:resolve(out,file+'-wheels.png')});
  reports.push({file,...result});await page.close();console.log('✔',file,'both rendered wheels turn forward/reverse and stop');
 }
 const specials=[['Dodge Viper ACR Extreme Aero','ViperApp'],['Maserati MCXtrema','MCXtremaApp'],['Peugeot 9X8','Peugeot9X8App'],['Zenvo Aurora Agil','AuroraApp'],['McLaren Solus GT','SolusApp']];
 for(const [file,name] of specials){
  for(const [width,height] of [[1440,1000],[1280,720],[390,844]]){
   const page=await open(file,name,{width,height});await page.waitForFunction(n=>window[n]?.cockpitArtReady?.(),name);
   const result=await page.evaluate(name=>{
    const a=window[name],s=a.state;Object.assign(s,{speedMps:100/3.6,rpm:4500,gearMode:'G',curGear:3,steer:.3,lights:false,dataHud:false,ambient:false,heat:false,cool:false});a.updateUi();
    const c=a.el.worldCanvas||document.getElementById('worldCanvas'),ctx=c.getContext('2d'),original=ctx.drawImage;let before;
    const getBand=()=>[...ctx.getImageData(c.width*.2,c.height*.46,c.width*.6,c.height*.20).data];
    ctx.drawImage=function(...args){if(!before)before=getBand();return original.apply(this,args);};
    a.drawWorld();ctx.drawImage=original;const after=getBand();
    const bandVisible=after.some((v,i)=>i%4!==3&&v>60);
    const overlap=[];for(const x of [.35,.5,.65])for(const y of [.47,.55,.65]){const e=document.elementFromPoint(innerWidth*x,innerHeight*y);if(e?.closest('.hud,.bottombar,.topbar,.touch-wheel,.mobile-pad'))overlap.push([x,y,e.outerHTML.slice(0,70)]);}
    const go=document.querySelector('[data-pad="up"]'),wheel=document.getElementById('touchWheel');
    const gr=go.getBoundingClientRect(),wr=wheel.getBoundingClientRect();
    const touchSeparate=!gr.width||gr.right<wr.left||gr.left>wr.right||gr.bottom<wr.top||gr.top>wr.bottom;
    return {unchanged:JSON.stringify(before)===JSON.stringify(after),bandVisible,overlap,touchSeparate,overflow:document.documentElement.scrollWidth>innerWidth};
   },name);
   assert(result.unchanged&&result.bandVisible,`${file} ${width}: cockpit must not paint over the road from horizon to 66% of viewport`);
   assert.deepEqual(result.overlap,[]);assert(result.touchSeparate);assert(!result.overflow);
   if(out)await page.screenshot({path:resolve(out,file+`-${width}.png`)});
   // The full drawing and real interactive controls remain reachable from Drive.
   await page.locator('[data-view="cockpit"]').click();assert(await page.locator('#cabinArt svg').isVisible());
   await page.close();reports.push({file,width,...result});
  }
  console.log('✔',file,'clear driving view at desktop, laptop and phone sizes; Cockpit reachable');
 }
 const files=readdirSync(root).filter(f=>f.endsWith(' F1 2026 simulator.html'));
 for(const filename of files){
  const file=filename.replace(/ simulator.html$/,'');
  const name=({'Red Bull':'Redbull','McLaren':'Mclaren','Aston Martin':'Aston','Racing Bulls':'Racingbulls'}[file.replace(' F1 2026','')]||file.replace(' F1 2026',''))+'F1App';
  const page=await open(file,name);
  const result=await page.evaluate(name=>{
   const a=window[name],s=a.state,dt=1/120;
   const straight=()=>{a.resetCar();s.rivals=[];s.raceGrid=false;s.assist=false;s.ignition=true;s.started=true;s.harness=true;s.keys={};s.route={active:true,name:'Verification straight',env:'track',totalM:100000,remainingM:100000,trackCorners:[],baseWidth:20,loop:false};a.setGear('G',1);};
   straight();s.keys.KeyW=true;
   let min=Infinity,max=0;
   for(let i=0;i<120*120;i++){a.updatePhysics(dt);s.time+=dt;if(i>=60*120){min=Math.min(min,s.speedMps*3.6);max=Math.max(max,s.speedMps*3.6);}}
   const normal={min,max,store:s.ersStore,x:s.xMode};
   s.keys.KeyW=false;s.keys.Space=true;for(let i=0;i<60;i++)a.updatePhysics(dt);const braking={x:s.xMode,speed:s.speedMps*3.6};
   straight();a.toggleRealMode();s.rivals=[];s.raceGrid=false;s.keys.KeyW=true;s.speedMps=40/3.6;s.rpm=6000;a.updatePhysics(dt);const start40=s.mguKPowerKw;
   s.speedMps=60/3.6;a.updatePhysics(dt);const start60=s.mguKPowerKw;
   s.throttle=1;s.brake=0;s.curGear=7;s.rpm=10000;s.speedMps=350/3.6;s.ersStore=1;s.keys.KeyX=true;a.updatePhysics(dt);const standard350=s.mguKPowerKw;
   s.rivals=[{distM:s.distanceM+50,lane:4,speedMps:90}];s.keys.KeyV=true;s.speedMps=350/3.6;a.updatePhysics(dt);const override350=s.mguKPowerKw;
   s.speedMps=355/3.6;a.updatePhysics(dt);const cutoff355=s.mguKPowerKw;
   s.keys.KeyV=false;s.rivals=[];s.ersStore=0;s.speedMps=330/3.6;s.keys.KeyX=false;a.updatePhysics(dt);const zAcceleration=s.speedMps-330/3.6;
   s.speedMps=330/3.6;s.keys.KeyX=true;a.updatePhysics(dt);const xAcceleration=s.speedMps-330/3.6;
   s.speedMps=360/3.6;a.updatePhysics(dt);const realAbove354=s.speedMps*3.6;
   // Fixed-speed power bench tests the production energy integrator independently of tyre wear and corners.
   s.keys.KeyX=true;s.throttle=1;s.ersStore=1;s.curGear=6;s.rpm=10000;let spent=0,maxMgu=0,maxPower=0;
   for(let i=0;i<25*120;i++){s.speedMps=250/3.6;s.rpm=10000;a.updatePhysics(dt);s.time+=dt;spent+=s.mguKPowerKw*dt/1000;maxMgu=Math.max(maxMgu,s.mguKPowerKw);maxPower=Math.max(maxPower,s.powerUnitKw);}
   const real={store:s.ersStore,spent,maxMgu,maxPower,emptyMgu:s.mguKPowerKw};
   s.keys.KeyW=false;s.throttle=0;s.brake=0;s.ersStore=.5;s.speedMps=250/3.6;s.rpm=10000;a.updatePhysics(dt);const regen={kw:s.ersHarvestKw,v:s.speedMps,store:s.ersStore};
   s.ersStore=.5;s.ersHarvestMJ=s.ersLapLimitMJ;s.speedMps=250/3.6;a.updatePhysics(dt);const blockedRegen=s.ersHarvestKw;
   a.onRaceLap();s.speedMps=250/3.6;s.ersStore=.5;a.updatePhysics(dt);const newLapRegen=s.ersHarvestKw;
   s.ersStore=1;s.speedMps=250/3.6;a.updatePhysics(dt);const fullRegen=s.ersHarvestKw;
   s.ersStore=0;s.inPitLane=true;s.pitStage="box";a.toggleRealMode();const restored=s.ersStore,pitCleared=!s.inPitLane&&!s.pitStage;straight();s.keys.KeyW=true;
   for(let i=0;i<60*120;i++){a.updatePhysics(dt);s.time+=dt;}
   const again=s.speedMps*3.6;
   const fn=a.mguKPowerKwAt;
   return {normal,braking,start40,start60,standard350,override350,cutoff355,zAcceleration,xAcceleration,realAbove354,pitCleared,real,regen,blockedRegen,newLapRegen,fullRegen,restored,again,curve:[fn(290),fn(340),fn(345),fn(337.5,true),fn(345,true),fn(355,true),fn(300,false,true)]};
  },name);
  assert(Math.abs(result.normal.min-354)<.001&&Math.abs(result.normal.max-354)<.001,JSON.stringify({file,normal:result.normal}));
  assert.equal(result.normal.store,1);assert(result.normal.x);assert(!result.braking.x&&result.braking.speed<354);
  assert.equal(result.start40,0);assert(result.start60>0);
  assert.equal(result.standard350,0);assert(result.override350>0&&result.override350<=100);assert.equal(result.cutoff355,0);assert(result.xAcceleration>result.zAcceleration);assert(result.realAbove354>354);assert(result.pitCleared);
  assert(result.real.store<1e-8&&result.real.emptyMgu<1e-6);assert(Math.abs(result.real.spent-4)<1e-6);assert(result.real.maxMgu<=350.00001&&result.real.maxPower<=739.50001);
  assert(result.regen.kw>0&&result.regen.kw<=350&&result.regen.v<250/3.6&&result.regen.store>.5);
  assert.equal(result.blockedRegen,0);assert(result.newLapRegen>0);assert.equal(result.fullRegen,0);assert.equal(result.restored,1);assert(Math.abs(result.again-354)<.001);
  assert.deepEqual(result.curve,[350,100,0,350,200,0,250]);
  reports.push({file,...result});console.log('✔',file,'354 km/h held for 60 s after acceleration; Real Mode energy/power/start/harvest limits; mode switching');await page.close();
 }
 if(out)writeFileSync(resolve(out,'driving-regressions.json'),JSON.stringify(reports,null,2));
}finally{await browser.close();}
console.log('All driving regressions passed.');
