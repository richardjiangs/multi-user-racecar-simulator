import fs from'node:fs';import assert from'node:assert/strict';import{createRequire}from'node:module';const require=createRequire(process.env.CODEX_NODE_MODULES+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;Math.random=()=>.5});
const audit=JSON.parse(fs.readFileSync('tests/track2/build-audit.json')),data=JSON.parse(fs.readFileSync('tools/tracks2/track-data.json')),seen=new Set(),rows=[];
for(const[key,info]of Object.entries(audit)){
 await page.goto('http://127.0.0.1:8000/'+encodeURIComponent(info.file));await page.waitForFunction(n=>window[n]?.drawWorld,nullArg(info.app),{polling:100,timeout:30000});
 const names=await page.evaluate(n=>Object.keys(window[n].CIRCUITS),info.app);const tracks=[names.includes('Circuit de Monaco')?'Circuit de Monaco':names.find(n=>data[n]),...names.filter(n=>data[n]&&!seen.has(n))].filter((v,i,a)=>a.indexOf(v)===i);
 for(const name of tracks){
  const r=await page.evaluate(async({id,name})=>{const a=window[id],s=a.state;a.resetCar();a.selectCircuit(name);await a.prepareTrack(name);a.setView('drive');s.started=s.ignition=true;s.rivals=[];s.raceGrid=false;s.testDriver=false;s.assist=false;s.keys.ArrowUp=true;a.setGear('G',1);for(let i=0;i<120;i++){a.updatePhysics(1/120);s.time+=1/120;}a.drawWorld();a.updateUi();return{name,speed:s.speedMps,d:s.distanceM,n:s.laneOffset,rpm:s.rpm,renderer:a.worldRendererInfo(),pit:a.pitModel()?.length||0};},{id:info.app,name});
  assert.ok([r.speed,r.d,r.n,r.rpm].every(Number.isFinite),key+' '+name);assert.ok(r.d>0,key+' does not move on '+name);assert.equal(r.renderer.error,0);assert.equal(r.renderer.loaded.length,1);seen.add(name);rows.push({key,...r});
 }
 console.log('PASS',key,tracks.length);
}
function nullArg(x){return x}
fs.writeFileSync('tests/track2/variant-results.json',JSON.stringify({cars:Object.keys(audit).length,tracks:[...seen],rows,errors},null,2));await browser.close();assert.equal(errors.length,0);assert.equal(Object.keys(audit).length,63);assert.equal(seen.size,Object.keys(data).length);
