// Browser behavior and rendered-audio checks for the September 2026 artwork revision.
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=await import(process.env.CODEX_NODE_MODULES?pathToFileURL(resolve(process.env.CODEX_NODE_MODULES,'playwright/index.mjs')).href:'playwright');
const root=resolve(import.meta.dirname,'..'),out=process.env.VERIFICATION_DIR;
if(out)mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const cars=[['viper','Dodge Viper ACR Extreme Aero','ViperApp',10],['mcx','Maserati MCXtrema','MCXtremaApp',6],['peugeot','Peugeot 9X8','Peugeot9X8App',6],['zenvo','Zenvo Aurora Agil','AuroraApp',12]];
const reports=[];
try{
 for(const [key,file,appName,cyl] of cars){
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto(pathToFileURL(resolve(root,file+' simulator.html')).href);
  await page.waitForFunction(n=>window[n]?.cockpitArtReady?.(),appName);
  const instruments=await page.evaluate(n=>{
   const a=window[n];a.el.keyOverlay.style.display='none';a.state.started=true;a.state.ignition=true;
   Object.assign(a.state,{speedMps:100/3.6,rpm:4500,curGear:3,gearMode:'G',steer:.25});
   a.updateUi();a.drawWorld();
   const aliases={ignitionBtn:'startSwitchBtn',raceAeroBtn:'corseMapBtn',tcLevelBtn:'tcBtn',aeroStrategyBtn:'aeroBtn'};
   const missing=[...document.querySelectorAll('#cabinArt [data-control]')].filter(e=>!['gearNBtn','hazardBtn'].includes(e.dataset.control)&&!document.getElementById(aliases[e.dataset.control]||e.dataset.control)).map(e=>e.dataset.control);
   const paintIds=[...document.querySelectorAll('#cabinArt defs [id],#engineBay defs [id],#exteriorArt defs [id]')].map(e=>e.id);
   return {paintIds,speed:document.getElementById('cabSpeedArt').textContent,gear:document.getElementById('cabGearArt').textContent,wheel:document.getElementById('cabinWheelG').getAttribute('transform'),missing,art:[...document.querySelectorAll('#cabinArt>svg,#engineBay>svg,#exteriorArt>svg')].every(e=>e.dataset.handDrawn)};
  },appName);
  assert.equal(new Set(instruments.paintIds).size,instruments.paintIds.length,'Hidden panels must not shadow another panel’s paint definitions');
  assert.equal(instruments.speed,'100');assert.equal(instruments.gear,'3');assert.match(instruments.wheel,/rotate\(13/);assert.deepEqual(instruments.missing,[]);assert(instruments.art);
  await page.evaluate(n=>window[n].setView('cockpit'),appName);
  if(key==='viper'){
   await page.locator('#cabinArt [data-control="hazardBtn"]').click();assert(await page.evaluate(n=>window[n].state.hazards,appName));
   await page.locator('#cabPageArt').click();await page.evaluate(n=>window[n].updateUi(),appName);assert.equal(await page.locator('#cabPageArt').textContent(),'LAP TIMER');
  }
  if(key==='mcx'){
   await page.locator('#cabinArt [data-control="tcLevelBtn"]').first().click();assert.equal(await page.evaluate(n=>window[n].state.tcLevel,appName),7);
  }
  if(key==='peugeot'){
   await page.locator('#cabinArt [data-control="hybridBtn"]').first().click();assert.equal(await page.evaluate(n=>window[n].state.energyMode,appName),1);
  }
  if(key==='zenvo'){
   await page.locator('#cabinArt [data-control="hybridBtn"]').first().click();assert.equal(await page.evaluate(n=>window[n].state.hybrid,appName),false);
  }
  // Render the shipped audio graph, not a second test-only synthesis implementation.
  for(const rpm of [1500,4500]){
   const result=await page.evaluate(async({appName,rpm})=>{
    const a=window[appName];if(a.audio.ctx)await a.audio.ctx.close?.();a.audio.ready=false;
    window.AudioContext=function(){return new OfflineAudioContext(1,44100,44100);};
    a.audio.init();const s={...a.state,ignition:true,throttle:.8,rpm,boostBar:1.2,speedMps:60,curGear:3,gearMode:'G',roadInputG:0,hybrid:true,hybridEnergy:80,energyMode:1,driveMode:'race',exhaustValve:true};
    a.audio.update(s,1/60);a.audio.windGain.gain.cancelScheduledValues(0);a.audio.windGain.gain.value=0;a.audio.roadGain.gain.cancelScheduledValues(0);a.audio.roadGain.gain.value=0;
    const buf=await a.audio.ctx.startRendering(),data=buf.getChannelData(0),tail=data.slice(22050);let energy=0,peak=0,crossings=0;
    for(let i=0;i<tail.length;i++){energy+=tail[i]**2;peak=Math.max(peak,Math.abs(tail[i]));if(i&&tail[i-1]<0&&tail[i]>=0)crossings++;}
    const N=2048;let total=0,weighted=0;
    for(let k=1;k<N/2;k++){let re=0,im=0;for(let j=0;j<N;j++){const v=tail[j]*(.5-.5*Math.cos(2*Math.PI*j/(N-1))),ph=2*Math.PI*k*j/N;re+=v*Math.cos(ph);im-=v*Math.sin(ph);}const power=re*re+im*im;total+=power;weighted+=power*k*44100/N;}
    return {rms:Math.sqrt(energy/tail.length),peak,zeroCrossHz:crossings*2,centroidHz:weighted/total,cyl:a.audio.voiceModel.cyl,cycleHz:a.audio.oscs[0].o.frequency.value,samples:[...data]};
   },{appName,rpm});
   assert.equal(result.cyl,cyl);assert(Math.abs(result.cycleHz-rpm/120)<.001);assert(result.rms>.01&&result.rms<.5,`${key} ${rpm} output level ${result.rms}`);assert(result.peak<.98,`${key} clips`);assert(Number.isFinite(result.centroidHz));
   if(out){const samples=result.samples,b=Buffer.alloc(44+samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(44100,24);b.writeUInt32LE(88200,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);samples.forEach((v,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));writeFileSync(resolve(out,`${key}-${rpm}.wav`),b);}
   delete result.samples;reports.push({key,rpm,...result});
  }
  assert.deepEqual(errors,[]);await page.close();console.log('✔',file,'art, live instruments, cockpit controls, audio levels and crank frequency');
 }
 const v6=reports.filter(r=>['mcx','peugeot'].includes(r.key)&&r.rpm===4500);assert(Math.abs(v6[0].centroidHz-v6[1].centroidHz)>40,'The two V6 outputs must have distinct spectral balance');
 const page=await browser.newPage();await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto(pathToFileURL(resolve(root,'Aston Martin Valkyrie simulator.html')).href);
 await page.evaluate(()=>{AstonApp.el.keyOverlay.style.display='none';AstonApp.setView('cockpit');});
 const spec=()=>page.evaluate(()=>({amr:AstonApp.state.amrPro,power:AstonApp.SPEC.peakPowerW,top:AstonApp.SPEC.topSpeedMps,gears:AstonApp.SPEC.gearRatios.length}));
 const road=await spec();assert.equal(road.amr,false);
 await page.keyboard.press('y');const pro=await spec();assert.equal(pro.amr,true);assert.notEqual(pro.power,road.power);assert.equal(await page.locator('#amrProBtn').getAttribute('aria-pressed'),'true');
 await page.keyboard.down('y');await page.keyboard.down('y');await page.keyboard.up('y');assert.equal((await spec()).amr,false,'Held key repeats must not toggle repeatedly');
 await page.locator('#amrProArt').click();assert.equal((await spec()).amr,true);
 for(let i=0;i<4;i++)await page.locator('#amrProBtn').click();assert.deepEqual(await spec(),pro,'Repeated variant toggles must not compound power/aero');
 await page.evaluate(()=>AstonApp.resetCar());assert.deepEqual(await spec(),road,'Reset restores the road variant');
 console.log('✔ Valkyrie default road, Y, held-key suppression, drawn cockpit button, mode button, repeated toggles, reset');
 if(out)writeFileSync(resolve(out,'audio-metrics.json'),JSON.stringify(reports,null,2));
 console.log(JSON.stringify(reports.map(({key,rpm,rms,peak,centroidHz})=>({key,rpm,rms,peak,centroidHz})),null,2));
}finally{await browser.close();}
