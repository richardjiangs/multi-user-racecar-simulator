import fs from 'node:fs';import {fileURLToPath,pathToFileURL} from 'node:url';import {art} from './art.mjs';import {withDefaults} from '../driving/defaults.mjs';
const dir=fileURLToPath(new URL('.',import.meta.url));
export const definition={key:'thrustssc',label:'Thrust SSC',short:'ThrustSSC',mark:'SSC',appName:'ThrustSSCApp',body:'#16242c',stripe:'#dcb15e'};
const description='1997 · twin Rolls-Royce Spey afterburning turbofans · rear-wheel steering · solid aluminium wheels · 1,227.985 km/h two-way record.';
export function addThrust({bundle,cars,files,files2,snapshots,repo}){
 const indices=new Map(bundle.sims.lines.map((v,i)=>[v,i]));const records=[];
 for(const version of [1,2]){
  let src=fs.readFileSync(repo+'/'+(version===2?files2:files).supra,'utf8');
  src=src.replace(/\(function install\(app,key,svg,engineSvg,draw\)\{[\s\S]*?(?=<\/script>)/,'');
  src=src.replaceAll('SupraApp',definition.appName).replaceAll('"supra"','"thrustssc"').replaceAll('Toyota Supra MK4','Thrust SSC').replaceAll('Supra','ThrustSSC');
  src=src.replace('const AERO0 =',`Object.assign(SPEC,{name:'Thrust SSC',massKg:10700,redlineRpm:10000,idleRpm:5800,peakPowerW:60000000,peakPowerKw:60000,peakTorqueNm:0,gearRatios:[1],finalDrive:1,shiftTimeS:0,topSpeedKmh:1240.77,topSpeedMps:1240.77/3.6,topSpeedRecordKmh:1240.77,topSpeedRecordMps:1240.77/3.6,wheelRadiusM:.457,dragCd:.5,frontalAreaM2:5,rollingResistance:.012,brakeMaxMps2:4.5,aeroClA:.15});\nconst AERO0 =`);
  src=src.replaceAll('assist: true','assist: false');
  const start=src.indexOf('function drawCabinFrame('),end=src.indexOf('  function drawHeadlights(',start);if(start<0||end<0)throw Error('Thrust cockpit boundary');
  src=src.slice(0,start)+'function drawCabinFrame(w,h,pal){app.drawSSCCabin?.(ctx,w,h);}\n'+src.slice(end);
  const a=src.indexOf('  function injectExterior()'),b=src.indexOf('  Object.assign(app, { resizeCanvas',a);if(a<0||b<0)throw Error('Thrust art boundary');
  src=src.slice(0,a)+'  function injectArt() {}\n'+src.slice(b);
  src=src.replace('/* ===== main loop =====','const SSC_AUDIO_PROFILE='+fs.readFileSync(dir+'audio-profile.json','utf8')+';\n'+fs.readFileSync(dir+'audio.js','utf8')+'\n'+fs.readFileSync(dir+'runtime.js','utf8')+`\ninstallThrustSSC(window.ThrustSSCApp,${JSON.stringify(art)});\n/* ===== main loop =====`);
  src=src.replace('const CIRCUITS = {','const CIRCUITS = {\n"Black Rock Desert":{dist:21726.144,env:"desert",limitKmh:1241,loop:false,widthM:30,corners:0,blurb:"Black Rock land-speed course",track:[],bumps:[]},');
  src=src.replace('app.resizeCanvas(); app.injectArt();','app.resizeCanvas(); app.injectArt(); app.selectCircuit("Black Rock Desert");');
  src=src.replace('app.setMode("race");','app.setMode("race");');
  src=withDefaults(src,'thrustssc');
  const file='Thrust SSC simulator'+(version===2?' 2.0':'')+'.html';fs.writeFileSync(repo+'/'+file,src);
  bundle.sims.files['thrustssc'+(version===2?'@2':'')]=src.split('\n').map(line=>{if(!indices.has(line)){indices.set(line,bundle.sims.lines.length);bundle.sims.lines.push(line);}return indices.get(line);});
  (version===2?files2:files).thrustssc=file;records.push({version,file,bytes:Buffer.byteLength(src)});
 }
 bundle.exteriors.thrustssc=art.exterior;cars.thrustssc={...definition,file:files.thrustssc};snapshots.thrustssc={svg:art.exterior,routes:['Black Rock Desert',...snapshots.supra.routes]};
 fs.writeFileSync(dir+'manifest.json',JSON.stringify(records,null,2));
}
export function thrustCard(shell){if(shell.includes('data-car-card="thrustssc"'))return shell;return shell.replace(/(<section class="cars"[^>]*>)/,`$1<article class="car-card" data-car-card="thrustssc"><div class="photo"><img class="offline-exterior" data-offline-art="thrustssc" alt="Thrust SSC hand-drawn side elevation"></div><div class="car-info"><div class="car-title"><h2>Thrust SSC</h2><span>Britain · Black Rock · 1997</span></div><div class="specs"><div class="spec"><b>Twin Spey</b><small>afterburning turbofans</small></div><div class="spec"><b>1,227.985</b><small>km/h · two-way record</small></div><div class="spec"><b>Rear steer</b><small>solid alloy wheels</small></div><div class="spec"><b>15.5 m</b><small>overall length</small></div></div><p class="exterior">${description}</p><div class="actions"><button class="primary" data-practice="thrustssc">Private Practice</button><button class="secondary" data-learn="thrustssc">Learning</button></div></div></article>`);}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const files=JSON.parse(fs.readFileSync('tools/tracks2/sim-files.json')),files2=JSON.parse(fs.readFileSync('tools/tracks2/manifest.json')),snapshots=JSON.parse(fs.readFileSync('tools/offline/exteriors.json'));
 const bundle={sims:{lines:[],files:{}},exteriors:{}};
 addThrust({bundle,cars:{},files,files2,snapshots,repo:process.cwd()});
 for(const [p,value]of [['tools/tracks2/sim-files.json',files],['tools/tracks2/manifest.json',files2]])fs.writeFileSync(p,JSON.stringify(value,null,2)+'\n');
 console.log('Built both Thrust SSC editions.');
}
