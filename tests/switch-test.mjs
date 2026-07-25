#!/usr/bin/env node
/* switch-test.mjs — verifies switch.html's Joy-Con / Pro Controller mapping.

     node tests/switch-test.mjs        (run after tools/build-switch.mjs)

   Serves the repo over localhost, installs a fake Switch Pro Controller in
   the page (navigator.getGamepads driven by window.__pad), then drives the
   whole game with it: pointer, opening a car, analog throttle/brake/steering,
   horn, the per-car speed feature, and back-to-garage.
*/
import { resolve, join, extname, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  const g = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(resolve(g, "playwright/index.mjs")).href);
}
const { chromium } = await loadPlaywright();
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".avif":"image/avif",".webp":"image/webp"};
const server=createServer(async(q,s)=>{try{const u=decodeURIComponent(new URL(q.url,"http://x").pathname);const f=join(ROOT,u==="/"?"index.html":u.slice(1));const b=await readFile(f);s.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});s.end(b);}catch{s.writeHead(404);s.end("no");}});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b = await chromium.launch({ args:["--autoplay-policy=no-user-gesture-required"] });
const p = await b.newPage({ viewport:{width:1280,height:720} });   // Switch handheld resolution
const errs=[]; p.on("pageerror",e=>errs.push(String(e.message||e).split("\n")[0]));

// ---- install a fake Switch Pro Controller driven by window.__pad ----
await p.addInitScript(() => {
  window.__pad = { axes:[0,0,0,0], buttons:new Array(16).fill(0) };
  const mk = () => ({
    id:"Pro Controller (STANDARD GAMEPAD)", index:0, connected:true, mapping:"standard",
    timestamp: performance.now(), axes: window.__pad.axes.slice(),
    buttons: window.__pad.buttons.map(v => ({ pressed: v > 0.5, touched: v > 0, value: v })),
  });
  navigator.getGamepads = () => [mk(), null, null, null];
});
let pass=0, fail=0;
const ck=(l,ok,d)=>{ console.log(`   ${ok?"✔":"✘ FAIL"}  ${l}${d?"  "+d:""}`); ok?pass++:fail++; };
const set = (o) => p.evaluate((o)=>{ if(o.axes) o.axes.forEach((v,i)=>{ if(v!==null) window.__pad.axes[i]=v; }); if(o.btn) Object.entries(o.btn).forEach(([i,v])=>window.__pad.buttons[+i]=v); }, o);
const frames = (n=12) => p.evaluate((n)=>new Promise(r=>{let i=0;(function f(){ if(++i>=n) return r(); requestAnimationFrame(f); })();}), n);

await p.goto(BASE+"switch.html", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(1200);

console.log("▶ switch shell");
ck("36 car cards render", await p.locator(".car-card").count()===36);
ck("virtual cursor present", await p.locator("#nxCursor").count()===1);
await frames(8);
ck("controller detected", (await p.locator("#nxHelp").innerText()).includes("controller ready"));

console.log("▶ right stick moves the pointer");
const c0 = await p.evaluate(()=>document.getElementById("nxCursor").style.transform);
await set({ axes:[0,0,0.9,0.5] }); await frames(20); await set({ axes:[0,0,0,0] }); await frames(3);
const c1 = await p.evaluate(()=>document.getElementById("nxCursor").style.transform);
ck("pointer moved with right stick", c0!==c1, c1);

console.log("▶ A opens a car (pointer + click)");
// park the pointer over the Bugatti practice button, then press A
await p.evaluate(()=>{ const r=document.querySelector('[data-practice="bugatti"]').getBoundingClientRect();
  const ev=new Event("x"); window.__nx={x:r.left+r.width/2,y:r.top+r.height/2}; });
await p.evaluate(()=>{ /* place cursor by driving the internal vars through a big stick nudge is fragile - click directly via the layer */ });
// drive the cursor there deterministically using the stick, then A
await p.evaluate(async ()=>{
  const t=window.__nx; const cur=document.getElementById("nxCursor");
  // read current pos from transform
  const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(cur.style.transform||"translate(0px, 0px)");
  window.__from={x:(m?+m[1]:0)+13,y:(m?+m[2]:0)+13};
});
const from = await p.evaluate(()=>window.__from), to = await p.evaluate(()=>window.__nx);
// nudge stick in the right direction until close
for (let i=0;i<120;i++){
  const cur = await p.evaluate(()=>{const c=document.getElementById("nxCursor");const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(c.style.transform||"translate(0px, 0px)");return {x:(m?+m[1]:0)+13,y:(m?+m[2]:0)+13};});
  const dx=to.x-cur.x, dy=to.y-cur.y;
  if (Math.abs(dx)<6 && Math.abs(dy)<6) break;
  await set({ axes:[0,0,Math.max(-1,Math.min(1,dx/60)),Math.max(-1,Math.min(1,dy/60))] });
  await frames(2);
}
await set({ axes:[0,0,0,0] }); await frames(3);
await set({ btn:{1:1} }); await frames(4); await set({ btn:{1:0} }); await p.waitForTimeout(1800);
const opened = await p.evaluate(()=>{ const f=document.getElementById("simFrame"); let app=null; try{app=!!f.contentWindow.BugattiApp;}catch(e){} return {app, visible: !!document.body.className.match(/practice-active|online-active/)}; });
ck("A clicked the card and the car booted", opened.app===true, JSON.stringify(opened));

console.log("▶ driving inputs");
await set({ btn:{7:1.0} }); await frames(10);   // ZR
const thr = await p.evaluate(()=>{try{return document.getElementById("simFrame").contentWindow.BugattiApp.state.padThrottle;}catch(e){return null;}});
ck("ZR sets analog throttle", thr>0.8, "padThrottle="+thr);
await set({ btn:{7:0}, }); await frames(4);
await set({ btn:{6:1.0} }); await frames(8);    // ZL
const brk = await p.evaluate(()=>{try{return document.getElementById("simFrame").contentWindow.BugattiApp.state.padBrake;}catch(e){return null;}});
ck("ZL sets analog brake", brk>0.8, "padBrake="+brk);
await set({ btn:{6:0} }); await frames(4);
await set({ axes:[0.8,0,0,0] }); await frames(8);
const steer = await p.evaluate(()=>{try{const s=document.getElementById("simFrame").contentWindow.BugattiApp.state;return {ts:s.touchSteer,ta:s.touchActive};}catch(e){return null;}});
ck("left stick steers (analog)", steer && steer.ts>0.6 && steer.ta===true, JSON.stringify(steer));
await set({ axes:[0,0,0,0] }); await frames(6);
const steer0 = await p.evaluate(()=>{try{return document.getElementById("simFrame").contentWindow.BugattiApp.state.touchSteer;}catch(e){return null;}});
ck("steering recentres on release", steer0===0, "touchSteer="+steer0);

console.log("▶ face buttons");
await set({ btn:{3:1} }); await frames(6);
const horn = await p.evaluate(()=>{try{return document.getElementById("simFrame").contentWindow.BugattiApp.state.horn;}catch(e){return null;}});
ck("X sounds the horn", horn===true, "horn="+horn);
await set({ btn:{3:0} }); await frames(4);
const hornOff = await p.evaluate(()=>{try{return document.getElementById("simFrame").contentWindow.BugattiApp.state.horn;}catch(e){return null;}});
ck("horn stops on release", hornOff===false);
const spBefore = await p.evaluate(()=>{try{return document.getElementById("simFrame").contentWindow.BugattiApp.state.speedKey;}catch(e){return null;}});
await set({ btn:{2:1} }); await frames(6); await set({ btn:{2:0} }); await frames(4);
const spAfter = await p.evaluate(()=>{try{return document.getElementById("simFrame").contentWindow.BugattiApp.state.speedKey;}catch(e){return null;}});
ck("Y toggles the car's speed feature (Speed Key)", spBefore!==spAfter, `${spBefore} -> ${spAfter}`);

console.log("▶ B returns to the garage");
await set({ btn:{0:1} }); await frames(6); await set({ btn:{0:0} }); await p.waitForTimeout(900);
const back = await p.evaluate(()=>({ practice: document.body.classList.contains("practice-active"), cards: document.querySelectorAll(".car-card").length }));
ck("B went back to the garage", back.practice===false && back.cards===36, JSON.stringify(back));

ck("no page errors", errs.length===0, errs.slice(0,2).join(" | "));
console.log(`\n${fail===0?"All Switch controller checks passed.":fail+" FAILED"}  (${pass} passed)`);
await b.close(); server.close();
process.exit(fail?1:0);
