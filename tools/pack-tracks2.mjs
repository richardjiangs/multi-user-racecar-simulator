// Builds the shared asset from precomputed meshes; never used at driving time.
import fs from 'node:fs';import path from 'node:path';import{gzipSync}from'node:zlib';
const root=path.resolve(import.meta.dirname,'..'),source=path.resolve(process.argv[2]||'/tmp/track2-world');
const data=JSON.parse(fs.readFileSync(path.join(source,'track-data.json'))),meshes=JSON.parse(fs.readFileSync(path.join(source,'world-meshes.json'))),packed={};
for(const[n,m]of Object.entries(meshes)){
 const b=Buffer.from(m.data,'base64');for(let i=0;i<b.length;i+=16)for(let k=0;k<3;k++)if(!Number.isFinite(b.readFloatLE(i+k*4)))throw new Error(n+' has non-finite mesh vertices');
 packed[n]={vertices:m.vertices,gzip:gzipSync(b,{level:9}).toString('base64')};
}
const script=`/* Prebuilt shared circuits. Sources and approximation notes: sources.json. */\nwindow.TRACK2_UNPACK=(async()=>{const data=${JSON.stringify(data)},packed=${JSON.stringify(packed)},meshes={};for(const[name,m]of Object.entries(packed)){const bytes=Uint8Array.from(atob(m.gzip),c=>c.charCodeAt(0));const unpacked=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();meshes[name]={vertices:m.vertices,bytes:new Uint8Array(unpacked)};}return{data,meshes};})();\nwindow.TRACK2_READY=window.TRACK2_READY||window.TRACK2_UNPACK;\n`;
fs.mkdirSync(path.join(root,'assets/tracks-2'),{recursive:true});fs.writeFileSync(path.join(root,'assets/tracks-2/pack.js'),script);fs.writeFileSync(path.join(root,'tools/tracks2/track-data.json'),JSON.stringify(data));console.log('Track asset',(script.length/1024/1024).toFixed(2),'MiB');
