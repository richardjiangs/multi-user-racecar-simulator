// Rebuild all fixed circuit meshes from the checked-in source, then pack them.
// Usage: node tools/build-track2-world.mjs && node tools/pack-tracks2.mjs /tmp/track2-world
import fs from'node:fs';import vm from'node:vm';import path from'node:path';
const source=path.join(import.meta.dirname,'tracks2'),out=process.argv[2]||'/tmp/track2-world',data=JSON.parse(fs.readFileSync(path.join(source,'track-data.json')));
const app={state:{route:{}},CIRCUITS:Object.fromEntries(Object.keys(data).map(n=>[n,{}])),clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};app.halfWidthAt=d=>app.trackWidthAt(d);
const env={window:{__Track2App:app},TRACK_DATA:data,console,Math,ArrayBuffer,DataView};vm.createContext(env);for(const f of['track-runtime.js','world-builder.js'])vm.runInContext(fs.readFileSync(path.join(source,f),'utf8'),env);
const meshes={};for(const[name,t]of Object.entries(data)){app.state.route={active:true,name,totalM:t.L};const original=app.pitSurface,cache=new Map();app.pitSurface=(q,n=0,h=0)=>{const key=q+','+n;if(!cache.has(key))cache.set(key,original(q,n,0));return{...cache.get(key),y:cache.get(key).y+h}};const w=env.buildCircuitWorld(app);app.pitSurface=original;meshes[name]={vertices:w.vertices,data:Buffer.from(w.buffer).toString('base64')};console.log(name,w.vertices);}
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'world-meshes.json'),JSON.stringify(meshes));fs.copyFileSync(path.join(source,'track-data.json'),path.join(out,'track-data.json'));
