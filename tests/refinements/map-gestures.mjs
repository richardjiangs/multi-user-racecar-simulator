import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/Users/daisy/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const page=await browser.newPage({hasTouch:true,viewport:{width:1440,height:900}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));const cdp=await page.context().newCDPSession(page);
try{
 await page.goto('http://127.0.0.1:8000/');await page.waitForFunction(()=>window.__mucs);
 for(const key of ['bugatti','db5','f1mercedes']){
  await page.selectOption('#trackVersion','2');await page.evaluate(k=>__mucs.openPractice(k),key);await page.waitForFunction(()=>__mucs.getSimApp()?.gps,null,{timeout:60000});
  const f=page.frames().find(f=>f!==page.mainFrame());await f.locator('#startBtn').click();
  await page.evaluate(()=>{const a=__mucs.getSimApp();a.setView('drive');a.gps.setMode('line');a.gps.setPreset(1);});await page.waitForTimeout(350);
  const canvas=f.locator('#gpsViewport'),box=await canvas.boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
  await page.mouse.move(x,y);await page.mouse.wheel(0,-180);await page.waitForTimeout(200);
  const wheel=await page.evaluate(()=>__mucs.getSimApp().gps.inspect().zoom);assert.ok(wheel>1);
  const touches=gap=>[{id:1,x:x-gap,y},{id:2,x:x+gap,y}];
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touches(25)});
  for(const gap of [30,35,40,45,50])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:touches(gap)});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);
  const pinch=await page.evaluate(()=>__mucs.getSimApp().gps.inspect());assert.ok(pinch.zoom>wheel*1.7);assert.equal(pinch.preset,1);
  assert.equal(await f.locator('#gpsUnit button:visible').count(),0);
  await canvas.click();await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>__mucs.getSimApp().gps.inspect().preset),2);
  const before=await canvas.boundingBox(),tx=before.x+before.width/2,ty=before.y+before.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:tx,y:ty}]});
  for(let i=1;i<=10;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:tx-i*20,y:ty-i*12}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);
  const after=await canvas.boundingBox();assert.ok(after.x<before.x-150);assert.ok(after.y<before.y-80);assert.equal(await page.evaluate(()=>__mucs.getSimApp().gps.inspect().preset),2,'Drag must not switch preset');
  checks.push({key,wheelZoom:wheel,pinchZoom:pinch.zoom,touchDrag:{x:after.x-before.x,y:after.y-before.y},visibleButtons:0});await page.evaluate(()=>__mucs.backToGarage());
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('tests/refinements/map-gesture-results.json',JSON.stringify({checks,errors},null,2));console.log('PASS outline mouse-wheel, touch pinch, click preset and no buttons:',checks.length,'cars');
}finally{await browser.close();}
