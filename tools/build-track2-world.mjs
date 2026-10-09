// Rebuild immutable circuit meshes one at a time; never generate geometry during driving.
import fs from'node:fs';import vm from'node:vm';import path from'node:path';
const source=path.join(import.meta.dirname,'tracks2'),out=process.argv[2]||'/tmp/track2-world',data=JSON.parse(fs.readFileSync(path.join(source,'track-data.json')));
const app={state:{route:{}},CIRCUITS:Object.fromEntries(Object.keys(data).map(n=>[n,{}])),clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};app.halfWidthAt=d=>app.trackWidthAt(d);
const env={window:{__Track2App:app},TRACK_DATA:data,console,Math,ArrayBuffer,DataView,Uint8Array};vm.createContext(env);for(const f of['track-runtime.js','rally-runtime.js','world-builder.js'])vm.runInContext(fs.readFileSync(path.join(source,f),'utf8'),env);
fs.mkdirSync(out,{recursive:true});const only=process.env.TRACK2_ONLY?new Set(process.env.TRACK2_ONLY.split('|')):null;const meshes=only?JSON.parse(fs.readFileSync(path.join(out,'mesh-index.json'))):{};let index=0;
for(const[name,t]of Object.entries(data)){if(only&&!only.has(name)){index++;continue;}
 app.state.route={active:true,name,totalM:t.L};const original=app.pitSurface,cache=new Map();app.pitSurface=(q,n=0,h=0)=>{const key=q+','+n;if(!cache.has(key))cache.set(key,original(q,n,0));return{...cache.get(key),y:cache.get(key).y+h}};
 const w=env.buildCircuitWorld(app);app.pitSurface=original;const file='mesh-'+index+++'.bin';fs.writeFileSync(path.join(out,file),Buffer.from(w.buffer));meshes[name]={file,vertices:w.vertices,batches:w.batches};console.log(name,w.vertices,(w.buffer.byteLength/1048576).toFixed(1)+' MiB');
 for(const field of['samples','pitGeometry','roadGrid','fences','drivingLine'])delete t[field];cache.clear();
}
fs.writeFileSync(path.join(out,'mesh-index.json'),JSON.stringify(meshes));fs.copyFileSync(path.join(source,'track-data.json'),path.join(out,'track-data.json'));
