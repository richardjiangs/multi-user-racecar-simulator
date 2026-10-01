import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {CLASSIC_VOICES} from '../tools/refresh-classics-audio.mjs';
const root=resolve(import.meta.dirname,'..'),out=process.env.VERIFICATION_DIR;
const {chromium}=await import(process.env.CODEX_NODE_MODULES?pathToFileURL(resolve(process.env.CODEX_NODE_MODULES,'playwright/index.mjs')).href:'playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined}),results=[];
if(out)mkdirSync(out,{recursive:true});
const wave=pcm=>{const b=Buffer.alloc(44+pcm.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(96000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(pcm.length*2,40);pcm.forEach((v,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));return b;};
try{
 for(const [name,voice] of Object.entries(CLASSIC_VOICES)){
  const path=resolve(root,name+' simulator.html'),source=readFileSync(path,'utf8');
  execFileSync(process.execPath,[resolve(root,'tools/refresh-classics-audio.mjs')],{cwd:root});assert.equal(readFileSync(path,'utf8'),source,'audio regeneration is idempotent');
  const appName={'Ferrari 250 GTO':'GtoApp','Ferrari F40':'F40App','Porsche 917':'P917App'}[name];
  const samples=[];
  for(const condition of ['idle','load','redline','noiseOnly']){
   const page=await browser.newPage();await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;window.AudioContext=function(){return new OfflineAudioContext(1,48000*2,48000);};});
   await page.goto(pathToFileURL(path).href);await page.waitForFunction(n=>!!window[n]?.audio,appName);
   const measurement=await page.evaluate(async({appName,condition,includePCM})=>{
    const a=window[appName],s={...a.state,ignition:true,exhaustValve:true,driveMode:'race',antiLag:false,windowsOpen:false,roadInputG:.1};
    const rpm=condition==='idle'?a.SPEC.idleRpm:condition==='load'||condition==='noiseOnly'?4500:a.SPEC.redlineRpm;
    Object.assign(s,{rpm,throttle:condition==='idle'?0:1,speedMps:condition==='idle'?0:condition==='load'?30:75,boostBar:condition==='idle'?0:1});
    a.audio.init();a.audio.update(s,1/60);if(condition==='noiseOnly'){a.audio.engineBus.gain.cancelScheduledValues(0);a.audio.engineBus.gain.value=0;}
    const rendered=await a.audio.ctx.startRendering(),d=rendered.getChannelData(0);let energy=0,peak=0,nonfinite=0;
    for(let i=24000;i<d.length;i++){const v=d[i];energy+=v*v;peak=Math.max(peak,Math.abs(v));if(!Number.isFinite(v))nonfinite++;}
    // Project onto firing harmonics in the settled last second, separately from random hiss.
    const firing=rpm/60*(appName==='F40App'?4:6),harmonics=[];
    for(let k=1;k<=4;k++){let re=0,im=0;for(let i=48000;i<96000;i++){const ph=2*Math.PI*firing*k*i/48000;re+=d[i]*Math.cos(ph);im+=d[i]*Math.sin(ph);}harmonics.push(2*Math.hypot(re,im)/48000);}
    return {rpm,rms:Math.sqrt(energy/(d.length-24000)),peak,nonfinite,harmonics,pcm:includePCM?Array.from(d):undefined};
   },{appName,condition,includePCM:!!out&&condition==='load'});
   if(out&&measurement.pcm)writeFileSync(resolve(out,name.replaceAll(' ','-')+'.wav'),wave(measurement.pcm));delete measurement.pcm;
   assert.equal(measurement.nonfinite,0);assert(measurement.peak<.99,name+' '+condition+' no digital clipping: '+measurement.peak);assert(measurement.rms>.003,name+' '+condition+' not silent');
   if(condition!=='noiseOnly')assert(measurement.harmonics[0]>.015,name+' firing tone is audible over noise');
   samples.push({condition,...measurement});await page.close();
  }
  assert(samples[1].rms>samples[3].rms*4,name+' engine dominates road/wind noise');
  assert(samples[1].harmonics[1]>.02,name+' shaped harmonic path is audible');
  results.push({name,samples});console.log('PASS '+name+': connected harmonics, idle/load/redline, no clipping; load peak '+samples[1].peak.toFixed(3));
 }
 assert.notDeepEqual(results[0].samples[1].harmonics,results[2].samples[1].harmonics,'GTO and 917 have different harmonic voices');
 if(out)writeFileSync(resolve(out,'audio-measurements.json'),JSON.stringify(results,null,2));
}finally{await browser.close();}
