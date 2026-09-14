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
  // Compare real rendered samples with the selected 919 voice, not a second synth model.
  const teams=[['Porsche 919','Porsche919App'],['Mercedes','MercedesF1App'],['McLaren','MclarenF1App'],['Williams','WilliamsF1App'],['Alpine','AlpineF1App'],['Ferrari','FerrariF1App'],['Haas','HaasF1App'],['Cadillac','CadillacF1App'],['Red Bull','RedbullF1App'],['Racing Bulls','RacingbullsF1App'],['Aston Martin','AstonF1App'],['Audi','AudiF1App']];
  const reference=new Map();
  for(const [team,name] of teams){
    const isReference=name==='Porsche919App';
    const p=await open(isReference?'Porsche 919 Hybrid simulator':team+' F1 2026 simulator',name);
    const scenarios=['idle','loaded','high','electric','regen'];
    if(isReference||team==='Mercedes')scenarios.push('startup','downshift','lift','off','recording');
    for(const scenario of scenarios){
      const r=await p.evaluate(async({name,scenario,isReference})=>{
        const a=window[name],au=a.audio;
        au.ready=false;au.useRecording=false;au.engineSrc=null;au.lastThrottle=0;au.blowoffAt=0;au.crackleAt=0;
        window.AudioContext=function(){return new OfflineAudioContext(1,88200,44100);};
        const random=Math.random;let seed=12345;
        Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
        let rendering;
        const rpm=['idle','startup'].includes(scenario)?1100:['high','electric'].includes(scenario)?12000:6000;
        try{
          au.init();
          const electric=scenario==='electric'?350:0,regen=scenario==='regen'?180:0;
          const power=isReference?{mguPowerKw:electric,regenPowerKw:regen}:{mguKPowerKw:electric,ersHarvestKw:regen};
          const s={...a.state,...power,ignition:true,rpm,throttle:['idle','startup','regen','lift'].includes(scenario)?0:.85,boostBar:scenario==='idle'?0:1.4,speedMps:['idle','startup'].includes(scenario)?0:60,roadInputG:0,curGear:6,driveMode:'race',exhaustValve:true,windowsOpen:false,antiLag:false};
          if(scenario==='recording')au.useEngineRecording(au.ctx.createBuffer(1,44100,44100));
          if(scenario==='lift'){au.lastThrottle=.85;au.blowoffAt=-1;au.crackleAt=-1;}
          au.update(s,1/60);
          for(const g of [au.windGain,au.roadGain]){g.gain.cancelScheduledValues(0);g.gain.value=0;}
          if(scenario==='startup')au.startupFlair();
          if(scenario==='downshift')au.blip(.9);
          if(scenario==='off'){
            const paused=au.ctx.suspend(.5);rendering=au.ctx.startRendering();await paused;
            au.update({...s,ignition:false},1/60);await au.ctx.resume();
          }else rendering=au.ctx.startRendering();
          const samples=(await rendering).getChannelData(0);
          let energy=0,peak=0;for(const v of samples.slice(66150)){energy+=v*v;peak=Math.max(peak,Math.abs(v));}
          return {rpm,rms:Math.sqrt(energy/22050),peak,pulsesHz:au.combPulse.frequency.value,electricGain:au.mguGain.gain.value,samples:[...samples]};
        }finally{Math.random=random;}
      },{name,scenario,isReference});
      assert(Math.abs(r.pulsesHz-r.rpm/30)<.001,'The selected sound keeps the 919 pulse order');
      assert(Number.isFinite(r.rms)&&r.peak<.98,team+' '+scenario+' invalid or clipped output');
      if(scenario==='off')assert(r.rms<.00001,'Engine must fade out after ignition off');
      else assert(r.rms>.001,team+' '+scenario+' unexpectedly silent');
      if(scenario==='high')assert.equal(r.electricGain,0);
      if(['electric','regen'].includes(scenario))assert(r.electricGain>.003,'F1 deployment/harvest must drive the copied motor sound');
      let maxSampleError=0;
      if(isReference)reference.set(scenario,r.samples);
      else{
        const expected=reference.get(scenario);assert.equal(r.samples.length,expected.length);
        for(let i=0;i<expected.length;i++)maxSampleError=Math.max(maxSampleError,Math.abs(r.samples[i]-expected[i]));
        // Web Audio graph summation can differ by a few Float32 ULPs between contexts.
        assert(maxSampleError<1e-6,team+' '+scenario+' differs from Porsche 919: '+maxSampleError);
      }
      if(out&&scenario==='loaded'){
        const b=Buffer.alloc(44+r.samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(44100,24);b.writeUInt32LE(88200,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(r.samples.length*2,40);r.samples.forEach((v,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));writeFileSync(resolve(out,'f1-'+team.replaceAll(' ','-')+'.wav'),b);
      }
      delete r.samples;reports.push({team,scenario,maxSampleError,...r});
    }
    await p.close();console.log('✔',team,isReference?'reference audio rendered':'matches Porsche 919 rendered sound');
  }
  for(const file of ['index','index-offline']){
    const p=await browser.newPage();await p.goto(pathToFileURL(resolve(root,file+'.html')).href);
    const link=p.getByRole('link',{name:'Report issue',exact:true});assert.equal(await link.getAttribute('href'),'https://github.com/richardjiangs/multi-user-racecar-simulator/issues/new/choose');assert(await link.isVisible());await p.close();
  }
  assert.deepEqual(errors,[]);
  if(out)writeFileSync(resolve(out,'f1-audio-metrics.json'),JSON.stringify(reports,null,2));
  console.log('✔ Both garage issue links; all eleven F1 voices match Porsche 919; hybrid adapter, transients, recording and ignition verified');
  console.table(reports.filter(r=>r.scenario==='loaded').map(({team,rms,peak,maxSampleError})=>({team,rms,peak,maxSampleError})));
}finally{await browser.close();}
