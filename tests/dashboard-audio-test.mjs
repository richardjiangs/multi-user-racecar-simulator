import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=await import(process.env.CODEX_NODE_MODULES?pathToFileURL(resolve(process.env.CODEX_NODE_MODULES,'playwright/index.mjs')).href:'playwright');
const root=resolve(import.meta.dirname,'..'),out=process.env.VERIFICATION_DIR;
if(out)mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
const errors=[],reports=[];
async function open(file,appName){
  const p=await browser.newPage({viewport:{width:1440,height:1000}});
  p.on('pageerror',e=>errors.push(`${file}: ${e.message}`));
  await p.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await p.goto(pathToFileURL(resolve(root,file+'.html')).href);
  await p.waitForFunction(n=>!!window[n]?.updateUi,appName);
  return p;
}
try{
  for(const [file,name] of [['Dodge Viper ACR Extreme Aero','ViperApp'],['Maserati MCXtrema','MCXtremaApp'],['Peugeot 9X8','Peugeot9X8App'],['Zenvo Aurora Agil','AuroraApp'],['McLaren Solus GT','SolusApp']]){
    const p=await open(file+' simulator',name);
    const assist=()=>p.evaluate(n=>window[n].state.assist,name);
    assert.equal(await assist(),false,`${file} must start without assist`);
    assert.equal(await p.locator('#assistBtn').getAttribute('aria-pressed'),'false');
    await p.evaluate(n=>window[n].el.keyOverlay.style.display='none',name);
    await p.keyboard.press('p');assert.equal(await assist(),true);
    await p.keyboard.down('p');await p.keyboard.down('p');await p.keyboard.up('p');assert.equal(await assist(),false,'repeat must not toggle twice');
    await p.keyboard.press('Control+p');assert.equal(await assist(),false);
    await p.evaluate(()=>{const input=document.createElement('textarea');input.id='typingTest';document.body.append(input);input.focus();});
    await p.keyboard.press('p');assert.equal(await assist(),false,'typing P is not a driving command');
    await p.locator('#typingTest').evaluate(e=>e.remove());
    // The bespoke cabins hide the legacy button; P routes through this same handler.
    await p.locator('#assistBtn').evaluate(e=>e.click());assert.equal(await assist(),true);
    await p.keyboard.press('p');assert.equal(await assist(),false,'button and keyboard share state');
    await p.keyboard.press('p');await p.evaluate(n=>window[n].resetCar(),name);assert.equal(await assist(),false);
    if(name==='AuroraApp'){
      const warning=await p.evaluate(()=>{AuroraApp.state.speedMps=357/3.6;AuroraApp.updateUi();return document.body.innerText;});
      assert.match(warning,/approaching 360 km\/h limit/);assert(!warning.includes('350 km/h mark'));
    }
    await p.close();console.log('✔',file,'assist default, P, repeats, modifiers, typing, button, reset');
  }
  // Representative unchanged cars, including the audio reference and the revised SSC cabin.
  for(const [file,name] of [['Porsche 919 Hybrid','Porsche919App'],['SSC Tuatara','TuataraApp'],['Mercedes F1 2026','MercedesF1App']]){
    const p=await open(file+' simulator',name);
    const original=await p.evaluate(n=>window[n].state.assist,name);
    await p.keyboard.press('p');assert.equal(await p.evaluate(n=>window[n].state.assist,name),original);
    if(name==='TuataraApp'){
      await p.evaluate(()=>{const a=TuataraApp;a.el.keyOverlay.style.display='none';Object.assign(a.state,{started:true,ignition:true,speedMps:125/3.6,rpm:6500,gearMode:'G',curGear:4,steer:.15,boostBar:1.7});a.setView('cockpit');a.updateUi();a.drawWorld();});
      assert.equal(await p.locator('#cabSpeedArt').textContent(),'125');assert.equal(await p.locator('#cabGearArt').textContent(),'4');
      assert.equal(await p.locator('#cabRpmArt').textContent(),'6500');assert.equal(await p.locator('#sscBoostArt').textContent(),'1.7 BAR');
      const missing=await p.locator('#cabinArt [data-control]').evaluateAll(nodes=>nodes.filter(e=>!document.getElementById(e.dataset.control)).map(e=>e.dataset.control));assert.deepEqual(missing,[]);
      const before=await p.evaluate(()=>TuataraApp.state.driveMode);
      await p.locator('#cabinArt [data-control="modeBtn"]').click();await p.evaluate(()=>TuataraApp.updateUi());
      assert.notEqual(await p.evaluate(()=>TuataraApp.state.driveMode),before);
      assert.equal(await p.locator('#sscModeArt').textContent(),await p.evaluate(()=>TuataraApp.state.driveMode.toUpperCase()));
      const cool=await p.evaluate(()=>TuataraApp.state.cool);
      await p.locator('#cabinArt [data-control="coolBtn"]').focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>TuataraApp.state.cool),!cool);
      await p.evaluate(()=>TuataraApp.updateUi());
      if(out){await p.locator('#cabinArt').screenshot({path:resolve(out,'ssc-cockpit.png')});await p.screenshot({path:resolve(out,'ssc-desktop.png')});}
      await p.evaluate(()=>{TuataraApp.setView('drive');TuataraApp.state.toastTimer=0;TuataraApp.el.toast.classList.remove('show');TuataraApp.drawWorld();});
      if(out)await p.screenshot({path:resolve(out,'ssc-drive.png')});
      await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{TuataraApp.resize?.();TuataraApp.drawWorld();});
      if(out)await p.screenshot({path:resolve(out,'ssc-mobile.png')});
    }
    await p.close();
  }
  console.log('✔ SSC live display, touchscreen, keyboard controls; other cars’ P behavior unchanged');
  const teams=[['Mercedes','MercedesF1App'],['McLaren','MclarenF1App'],['Williams','WilliamsF1App'],['Alpine','AlpineF1App'],['Ferrari','FerrariF1App'],['Haas','HaasF1App'],['Cadillac','CadillacF1App'],['Red Bull','RedbullF1App'],['Racing Bulls','RacingbullsF1App'],['Aston Martin','AstonF1App'],['Audi','AudiF1App']];
  for(const [team,name] of teams){
    const p=await open(team+' F1 2026 simulator',name);
    const scenarios=team==='Mercedes'?['low','high','off','shift','recording','electric','boost']:['low','high'];
    for(const scenario of scenarios){
      const r=await p.evaluate(async({name,scenario})=>{
        const a=window[name],au=a.audio;au.ready=false;au.useRecording=false;au.engineSrc=null;
        window.AudioContext=function(){return new OfflineAudioContext(1,88200,44100);};
        const random=Math.random;let seed=12345;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
        try{au.init();}finally{Math.random=random;}
        const rpm=scenario==='low'?6000:12000;
        const s={...a.state,ignition:true,retired:false,rpm,throttle:.85,boostBar:scenario==='boost'?2.2:0,speedMps:60,roadInputG:0,curGear:6,driveMode:'race',exhaustValve:true,shiftTimer:scenario==='shift'?.04:0,mguKPowerKw:scenario==='electric'?350:0,ersHarvestKw:0};
        if(scenario==='recording')au.useEngineRecording(au.ctx.createBuffer(1,44100,44100));
        au.update(s,1/60);
        for(const g of [au.windGain,au.roadGain]){g.gain.cancelScheduledValues(0);g.gain.value=0;}
        let rendering;
        if(scenario==='off'){
          const paused=au.ctx.suspend(.5);rendering=au.ctx.startRendering();await paused;
          au.update({...s,ignition:false,speedMps:0},1/60);await au.ctx.resume();
        }else rendering=au.ctx.startRendering();
        const samples=(await rendering).getChannelData(0),tail=samples.slice(66150);
        let sum=0,peak=0;for(const v of tail){sum+=v*v;peak=Math.max(peak,Math.abs(v));}
        const N=4096;let total=0,weighted=0,dominant=0,best=0;
        for(let k=1;k<1024;k++){
          let re=0,im=0;for(let j=0;j<N;j++){const x=tail[j]*(.5-.5*Math.cos(2*Math.PI*j/(N-1))),p=2*Math.PI*k*j/N;re+=x*Math.cos(p);im-=x*Math.sin(p);}
          const power=re*re+im*im;total+=power;weighted+=power*k*44100/N;if(power>best){best=power;dominant=k*44100/N;}
        }
        return {rpm,family:au.voiceModel.family,cycleHz:au.oscs[0].o.frequency.value,pulsesHz:au.combPulse.frequency.value,rms:Math.sqrt(sum/tail.length),peak,centroid:weighted/total,dominant,electricGain:au.mguTone.g.gain.value,turboGain:au.turboGain.gain.value,samples:[...samples]};
      },{name,scenario});
      assert(Math.abs(r.cycleHz-r.rpm/120)<.001);assert(Math.abs(r.pulsesHz-r.rpm/20)<.001);
      assert(r.peak<.98,`${team} ${scenario} clips: ${r.peak}`);
      if(['off','recording'].includes(scenario))assert(r.rms<.00001,`${scenario} leaked synthesized audio: ${r.rms}`);
      else assert(r.rms>.01&&r.rms<.5,`${team} ${scenario} audio level ${r.rms}`);
      if(scenario==='high')assert.equal(r.electricGain,0,'Electric motor is silent when neither deploying nor regenerating');
      if(scenario==='electric')assert(r.electricGain>.02);
      if(scenario==='boost')assert(r.turboGain>.03);
      if(out&&scenario==='high'){
        const b=Buffer.alloc(44+r.samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(44100,24);b.writeUInt32LE(88200,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(r.samples.length*2,40);r.samples.forEach((v,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));writeFileSync(resolve(out,`f1-${team.replaceAll(' ','-')}.wav`),b);
      }
      delete r.samples;reports.push({team,scenario,...r});
    }
    await p.close();console.log('✔',team,'F1 rendered audio, engine cycle, pulse frequency and headroom');
  }
  const mer=reports.filter(r=>r.team==='Mercedes'),high=mer.find(r=>r.scenario==='high'),low=mer.find(r=>r.scenario==='low'),shift=mer.find(r=>r.scenario==='shift');
  assert(high.dominant>low.dominant*1.8,'Exhaust pitch must rise with RPM');assert(shift.rms<high.rms*.4,'Shift must cut engine torque audibly');
  const families=new Map(reports.filter(r=>r.scenario==='high').map(r=>[r.family,r.centroid]));assert.equal(families.size,5);
  assert(new Set([...families.values()].map(v=>Math.round(v))).size===5,'Power unit families must have distinguishable spectra');
  for(const file of ['index','index-offline']){
    const p=await browser.newPage();await p.goto(pathToFileURL(resolve(root,file+'.html')).href);
    const link=p.getByRole('link',{name:'Report issue',exact:true});assert.equal(await link.getAttribute('href'),'https://github.com/richardjiangs/multi-user-racecar-simulator/issues/new/choose');assert(await link.isVisible());await p.close();
  }
  assert.deepEqual(errors,[]);
  if(out)writeFileSync(resolve(out,'f1-audio-metrics.json'),JSON.stringify(reports,null,2));
  console.log('✔ Both garage issue links, pitch tracking, shift cut, engine-off silence, recording isolation, five family spectra');
  console.table(reports.filter(r=>r.scenario==='high').map(({team,rms,peak,centroid,dominant})=>({team,rms,peak,centroid,dominant})));
}finally{await browser.close();}
