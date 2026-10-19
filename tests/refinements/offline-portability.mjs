import fs from'node:fs';import assert from'node:assert/strict';import{pathToFileURL}from'node:url';import{createRequire}from'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json'),pw=require('playwright'),results=[];
await Promise.all((process.argv.slice(2).length?process.argv.slice(2):['chromium','webkit','firefox']).map(async engine=>{
 const b=await pw[engine].launch(),p=await b.newPage(),errors=[];p.setDefaultTimeout(180000);p.on('pageerror',e=>errors.push(e.message));await p.route(/^https?:/,r=>r.abort());
 try{
  await p.goto(pathToFileURL(process.cwd()+'/index-offline.html').href,{waitUntil:'domcontentloaded',timeout:120000});await p.waitForFunction(()=>window.TRACK2_CATALOG,null,{timeout:60000});
  for(const name of ['Circuit de Monaco','Goodwood Hillclimb','Mission — Furka Pass & Auric Enterprises, 1964','Stage 11 — Bisha to Al-Hanakiya','Museo Ferrari, Maranello']){
   const result=await p.evaluate(async name=>{const t=performance.now(),m=await(await TRACK2_READY).ensure(name);return{vertices:m.vertices,bytes:m.bytes.length,ms:performance.now()-t};},name);
   assert.equal(result.bytes,result.vertices*16);results.push({engine,name,...result});console.log('PASS',engine,name,result.vertices,'vertices, integrity verified');
  }
  assert.deepEqual(errors,[]);
 }catch(error){throw Error(engine+': '+error.message,{cause:error});}finally{await b.close();}
}));fs.writeFileSync('tests/refinements/offline-portability-results.json',JSON.stringify(results,null,2));
