// Solus-specific behavior, rendered geometry and real audio graph regression checks.
import assert from 'node:assert/strict';
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const {chromium}=await import(process.env.CODEX_NODE_MODULES?pathToFileURL(resolve(process.env.CODEX_NODE_MODULES,'playwright/index.mjs')).href:'playwright');
const root=resolve(import.meta.dirname,'..'),out=process.env.VERIFICATION_DIR;
if(out)mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;Math.random=()=>.51;});
try{
 await page.goto(pathToFileURL(resolve(root,'McLaren Solus GT simulator.html')).href);
 await page.waitForFunction(()=>SolusApp.cockpitArtReady());
 await page.evaluate(()=>{const a=SolusApp;a.el.keyOverlay.style.display='none';a.state.started=true;a.state.ignition=true;a.state.raceGrid=false;a.state.rivals=[];a.setView('cockpit');a.updateUi();a.drawWorld();});
 const paint=await page.evaluate(()=>[...document.querySelectorAll('#cabinArt defs [id],#engineBay defs [id],#exteriorArt defs [id]')].map(e=>e.id));
 assert.equal(new Set(paint).size,paint.length,'Each SVG has independent material IDs');
 assert.equal(await page.locator('#gearStack i').count(),7,'Seven real gearbox ratios shown in Dynamics');
 const click=async id=>{await page.locator(`#cabinArt [data-control="${id}"]`).click();await page.evaluate(()=>SolusApp.updateUi());};
 await click('corseMapBtn');assert.equal(await page.evaluate(()=>SolusApp.state.powerMode),0);
 await page.keyboard.press('z');assert.equal(await page.evaluate(()=>SolusApp.state.powerMode),1);
 await page.keyboard.press('z');await page.keyboard.press('z');assert.equal(await page.evaluate(()=>SolusApp.state.powerMode),3);
 await click('tcBtn');assert.equal(await page.evaluate(()=>SolusApp.state.tcLevel),7);
 await click('absBtn');assert.equal(await page.evaluate(()=>SolusApp.state.abs),false);
 await click('biasBtn');assert.equal(await page.evaluate(()=>SolusApp.state.brakeBias),59);
 await click('pageBtn');assert.equal(await page.locator('#cabPageArt').textContent(),'LAP TIMER');
 await click('coolBtn');assert.equal(await page.evaluate(()=>SolusApp.state.cool),true);
 await click('ignitionBtn');assert.equal(await page.evaluate(()=>SolusApp.state.ignition),false);await click('ignitionBtn');
 await click('doorAllBtn');assert.equal(await page.evaluate(()=>SolusApp.state.doors.driver),true);
 assert.equal(await page.evaluate(()=>SolusApp.state.doors.passenger),false);
 await page.evaluate(()=>{SolusApp.state.speedMps=10;SolusApp.toggleDoor('all');});assert.equal(await page.evaluate(()=>SolusApp.state.doors.driver),true,'Canopy actuator inhibited while moving');
 await page.evaluate(()=>{SolusApp.state.speedMps=0;});await click('doorAllBtn');
 await click('frontForward');assert.equal(await page.evaluate(()=>SolusApp.state.frontRecline),5);await click('frontBack');assert.equal(await page.evaluate(()=>SolusApp.state.frontRecline),0);
 await click('pitBtn');assert.equal(await page.evaluate(()=>SolusApp.state.pitLimiter),true);await click('pitBtn');
 await click('gearNBtn');assert.equal(await page.evaluate(()=>SolusApp.state.gearMode),'N');
 await click('rearCameraBtn');assert.equal(await page.evaluate(()=>SolusApp.state.rearCamera),true);
 const behavior=await page.evaluate(()=>{
  const a=SolusApp,s=a.state,dt=1/120;
  function ready(speed=180/3.6){a.resetCar();s.ignition=true;s.started=true;s.raceGrid=false;s.rivals=[];s.assist=false;s.keys={};a.setGear('G',4);s.harness=true;s.speedMps=speed;s.rpm=8500;s.throttle=1;s.keys.KeyW=true;s.manualHold=4;}
  function acceleration(map){ready();s.powerMode=map;const v=s.speedMps;for(let i=0;i<60;i++)a.updatePhysics(dt);return s.speedMps-v;}
  const maps=[0,1,2,3].map(acceleration);
  function traction(tc){ready(12);s.curGear=1;s.rpm=9000;s.tcLevel=tc;const v=s.speedMps;for(let i=0;i<12;i++)a.updatePhysics(dt);return s.speedMps-v;}
  const tc=[traction(1),traction(12)];
  function brake(abs,bias){ready(100/3.6);s.keys={KeyS:true};s.throttle=0;s.brake=1;s.abs=abs;s.brakeBias=bias;const d=s.distanceM;for(let i=0;i<1000&&s.speedMps>.05;i++)a.updatePhysics(dt);return s.distanceM-d;}
  const braking=[brake(true,58),brake(false,58),brake(true,64)];
  ready(150*.44704);a.updateAero(dt);const df=s.downforceN/9.81;a.toggleAero();a.updateAero(dt);const dfDim=s.downforceN/9.81;
  a.resetCar();s.raceGrid=false;s.rivals=[];s.realMode=true;s.tyreWear=0;s.damage=0;s.retired=false;s.sys={engine:0,gearbox:0,brakes:0,tyre:0,susp:0,body:0};a.armLaunch();s.keys={KeyW:true};
  let top=0;for(let i=0;i<14400;i++){a.updatePhysics(dt);top=Math.max(top,s.speedMps*3.6);}
  const wear=s.tyreWear;s.retired=true;s.speedMps=0;s.launchActive=false;for(let i=0;i<120;i++)a.updatePhysics(dt);const retiredSpeed=s.speedMps;a.toggleRealMode();a.resetCar();const repaired=!s.retired&&s.tyreWear===0&&s.damage===0;
  a.resetCar();s.realMode=false;s.retired=false;s.tyreWear=0;s.damage=0;s.sys={engine:0,gearbox:0,brakes:0,tyre:0,susp:0,body:0};s.raceGrid=false;s.rivals=[];
  a.el.voiceInput.value='take me to Donington';a.processVoice();if(s.route.name!=='Donington Park GP')throw Error('Co-pilot did not select Donington');const track={dist:a.CIRCUITS['Donington Park GP'].dist,width:a.CIRCUITS['Donington Park GP'].widthM,corners:a.CIRCUITS['Donington Park GP'].track.length};
  a.enterLearning?.();const learn=!!s.learnMode; a.setView('cockpit');s.speedMps=100/3.6;s.rpm=9000;s.curGear=4;s.gearMode='G';s.steer=.25;a.updateUi();
  return {maps,tc,braking,df,dfDim,top,wear,retiredSpeed,repaired,track,learn,speed:document.getElementById('cabSpeedArt').textContent,gear:document.getElementById('cabGearArt').textContent};
 });
 assert(behavior.maps.every((v,i,a)=>i===0||v>a[i-1]),'Four response maps change acceleration monotonically');assert(behavior.tc[0]>behavior.tc[1]);assert(behavior.braking[1]>behavior.braking[0]+2);assert(behavior.braking[2]>behavior.braking[0]);assert(Math.abs(behavior.df-1200)<.001);assert.equal(behavior.df,behavior.dfDim);assert(behavior.top>322&&behavior.top<355,'Real mode follows power/drag, beyond Normal benchmark');assert(behavior.wear>0);assert.equal(behavior.retiredSpeed,0);assert(behavior.repaired);assert.deepEqual(behavior.track,{dist:4020,width:16,corners:12});assert(behavior.learn);assert.equal(behavior.speed,'100');assert.equal(behavior.gear,'4');
 const audio=[];
 for(const rpm of [2000,6000,10000]){
  const result=await page.evaluate(async rpm=>{const a=SolusApp;a.audio.ready=false;window.AudioContext=function(){return new OfflineAudioContext(1,44100,44100)};a.audio.init();a.audio.update({...a.state,ignition:true,rpm,throttle:.85,exhaustValve:true,driveMode:'race',speedMps:60,curGear:4,roadInputG:0},1/60);for(const g of [a.audio.windGain,a.audio.roadGain]){g.gain.cancelScheduledValues(0);g.gain.value=0;}
   const b=await a.audio.ctx.startRendering(),d=b.getChannelData(0),tail=d.slice(22050);let sum=0,peak=0,cross=0;for(let i=0;i<tail.length;i++){sum+=tail[i]**2;peak=Math.max(peak,Math.abs(tail[i]));if(i&&tail[i-1]<0&&tail[i]>=0)cross++;}
   return {rpm,rms:Math.sqrt(sum/tail.length),peak,crossHz:cross*2,cyl:a.audio.voiceModel.cyl,cycle:a.audio.oscs[0].o.frequency.value,intake:!!a.audio.intakeNode,compressor:!!a.audio.turboNode,samples:[...d]};},rpm);
  assert.equal(result.cyl,10);assert(Math.abs(result.cycle-rpm/120)<.01);assert(result.rms>.01&&result.rms<.5);assert(result.peak<.98);assert.equal(result.compressor,false);assert.equal(result.intake,true);
  if(out){let b=Buffer.alloc(44+result.samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(44100,24);b.writeUInt32LE(88200,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(result.samples.length*2,40);result.samples.forEach((v,i)=>b.writeInt16LE(Math.round(v*32767),44+i*2));writeFileSync(resolve(out,`solus-${rpm}.wav`),b);}
  delete result.samples;audio.push(result);
 }
 if(out){for(const view of ['exterior','cockpit','engine','learn']){await page.evaluate(view=>{SolusApp.setView(view);SolusApp.state.toastTimer=0;SolusApp.el.toast.classList.remove('show');SolusApp.updateUi();},view);await page.screenshot({path:resolve(out,`solus-${view}.png`)});}
 for(const [width,height] of [[1440,1000],[1280,720],[390,844]]){await page.setViewportSize({width,height});await page.waitForTimeout(100);await page.evaluate(()=>{SolusApp.setView('drive');SolusApp.resizeCanvas();SolusApp.drawWorld();});await page.screenshot({path:resolve(out,`solus-drive-${width}.png`)});}}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({behavior,audio},null,2));console.log('✔ Solus controls, canopy, pedals, instruments, physical maps/TC/ABS/bias, aero, wear, retirement, circuit, Learning and V10 audio');
 if(out)writeFileSync(resolve(out,'solus-metrics.json'),JSON.stringify({behavior,audio},null,2));
}finally{await browser.close();}
