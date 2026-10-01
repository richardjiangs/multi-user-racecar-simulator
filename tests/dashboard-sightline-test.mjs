import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {TOURING_CARS} from '../tools/refresh-touring-art.mjs';
import {NEXT_CARS} from '../tools/refresh-next-hypercars-art.mjs';
const root=resolve(import.meta.dirname,'..'),out=process.env.VERIFICATION_DIR;
const cars={ssc:['SSC Tuatara','TuataraApp'],bugatti:['Bugatti Chiron Super Sport 300+','BugattiApp'],koenigsegg:['Koenigsegg Jesko','KoenigseggApp'],p1:['McLaren P1','P1App'],ferrari:['Ferrari F80','FerrariApp'],alfa33:['Alfa Romeo 33 Stradale','Alfa33App'],...NEXT_CARS,...Object.fromEntries(Object.entries(TOURING_CARS).map(([k,[f,n]])=>[k,[f.replace(/ [Ss]imulator.html$/,''),n]]))};
const {chromium}=await import(process.env.CODEX_NODE_MODULES?pathToFileURL(resolve(process.env.CODEX_NODE_MODULES,'playwright/index.mjs')).href:'playwright');
if(out)mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined}),errors=[],results=[],reference=new Map();
const prepare=async(page,appName)=>page.evaluate(n=>{
 const a=window[n];a.el.keyOverlay.style.display='none';a.el.toast.classList.remove('show');
 Object.assign(a.state,{speedMps:100/3.6,rpm:4000,curGear:3,gearMode:'G',steer:0,dataHud:false,ambient:false,lights:false,cool:false,heat:false,time:12,rivals:[],distanceM:0});
 a.state.shake={x:0,y:0,rot:0};a.resizeCanvas();a.setView('drive');a.updateUi();a.el.toast.classList.remove('show');a.drawWorld();
},appName);
// Inspect actual rendered pixels in the road corridor, not a reported layout coordinate.
const corridor=async(page,appName)=>page.evaluate(n=>{
 const a=window[n],c=a.canvas,dpr=c.width/innerWidth;
 const x=Math.round(innerWidth*.40*dpr),y=Math.round(innerHeight*.53*dpr),w=Math.round(innerWidth*.20*dpr),h=Math.round(innerHeight*.10*dpr);
 const p=a.ctx.getImageData(x,y,w,h).data;let road=0;
 for(let i=0;i<p.length;i+=4){
  const row=y+Math.floor(i/4/w),f=(row/dpr-innerHeight*.46)/(innerHeight*.54);
  if(Math.abs(p[i]-(31+11*f))<1.6&&Math.abs(p[i+1]-(34+12*f))<1.6&&Math.abs(p[i+2]-(40+12*f))<1.6)road++;
 }
 return road/(w*h);
},appName);
try{
 for(const [key,[name,appName]] of Object.entries(cars)){
  const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(key+': '+e.message));
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto(pathToFileURL(resolve(root,TOURING_CARS[key]?.[0]||name+' simulator.html')).href);await page.waitForFunction(n=>!!window[n]?.drawWorld,appName);
  const sizes=[[1440,900],[1774,778],[1366,768],[1024,768],[390,844],[844,390]];
  if(key==='ssc'||key==='aston'||key==='mcf1'||key==='mclaren')sizes.push([900,600],[800,600],[600,800],[390,650]);
  for(const [w,h] of sizes){
   await page.setViewportSize({width:w,height:h});await page.waitForTimeout(90);await prepare(page,appName);
   const visible=await corridor(page,appName);results.push({key,w,h,roadFraction:visible});
   if(key==='ssc'){assert(visible>.8,'SSC reference road must be visible');reference.set(w+'x'+h,visible);}
   else assert(visible>=reference.get(w+'x'+h)-.025,key+' road corridor is more obscured than SSC at '+w+'x'+h+': '+visible);
   if(key==='aston'||key==='mcf1'||key==='mclaren'){
    const views=await page.evaluate(n=>window[n].rearViews,appName);
    assert.equal(views.length,2);assert.equal(views[0].y,views[1].y,'rear screens remain level');assert(views[0].x+views[0].w<w/2&&views[1].x>w/2,'rear screens stay on opposite sides');
    const overlaps=await page.evaluate(n=>{
     const obstacles=[...document.querySelectorAll('.topbar,.hud,.bottombar,.mobile-pad,.touch-wheel,.drive-help')].filter(e=>e.checkVisibility()).map(e=>({name:e.className,rect:e.getBoundingClientRect()}));
     return window[n].rearViews.flatMap((v,i)=>{
      const b={left:v.x-7,top:v.y-7,right:v.x+v.w+7,bottom:v.y+v.h+17};
      const hit=obstacles.filter(({rect:r})=>b.left<r.right&&b.right>r.left&&b.top<r.bottom&&b.bottom>r.top).map(o=>o.name);
      if(b.left<0||b.right>innerWidth||b.top<0||b.bottom>innerHeight)hit.push('viewport');
      return hit.map(name=>(i?'right':'left')+' camera overlaps '+name);
     });
    },appName);
    assert.deepEqual(overlaps,[],key+' visible rear cameras at '+w+'x'+h);
   }
   if(out){
    await page.screenshot({path:resolve(out,key+'-'+w+'x'+h+'.png')});
    if(w===1440){const png=await page.evaluate(n=>window[n].canvas.toDataURL('image/png'),appName);writeFileSync(resolve(out,key+'-drawing.png'),Buffer.from(png.split(',')[1],'base64'));}
   }
  }
  await page.close();console.log('PASS '+key+': unobstructed road at '+sizes.length+' viewport sizes');
 }
 // Prove the check catches the reported regression in the previous release.
 const old=execFileSync('git',['show','d99def1:Bugatti Chiron Super Sport 300+ simulator.html'],{cwd:root,encoding:'utf8',maxBuffer:2e6});
 const page=await browser.newPage({viewport:{width:1440,height:900}});await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.route('http://sightline.test/previous.html',r=>r.fulfill({contentType:'text/html',body:old}));await page.goto('http://sightline.test/previous.html');await page.waitForFunction(()=>!!window.BugattiApp?.drawWorld);await prepare(page,'BugattiApp');
 const previous=await corridor(page,'BugattiApp');assert(previous<.6,'test must detect the old high dashboard');console.log('PASS regression detected in previous release: '+Math.round(previous*100)+'% clear');
 await page.close();assert.deepEqual(errors,[]);
 if(out)writeFileSync(resolve(out,'sightlines.json'),JSON.stringify({results,previousReleaseRoadFraction:previous,errors},null,2));
}finally{await browser.close();}
