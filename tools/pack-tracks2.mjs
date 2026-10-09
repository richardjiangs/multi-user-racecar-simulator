// Pack build-time meshes separately. A whole route loads before driving starts.
import fs from'node:fs';import path from'node:path';import{gzipSync}from'node:zlib';import{createHash}from'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),source=path.resolve(process.argv[2]||'/tmp/track2-world'),out=path.join(root,'assets/tracks-2');
const data=JSON.parse(fs.readFileSync(path.join(source,'track-data.json'))),catalog={},files=[];
const indexPath=path.join(source,'mesh-index.json'),index=fs.existsSync(indexPath)?JSON.parse(fs.readFileSync(indexPath)):null,legacy=index?null:JSON.parse(fs.readFileSync(path.join(source,'world-meshes.json')));
fs.mkdirSync(out,{recursive:true});
for(const name of Object.keys(data)){
 const m=index?index[name]:legacy[name],b=index?fs.readFileSync(path.join(source,m.file)):Buffer.from(m.data,'base64');
 for(let i=0;i<b.length;i+=16)for(let k=0;k<3;k++)if(!Number.isFinite(b.readFloatLE(i+k*4)))throw Error(name+' has non-finite vertices');
 const id=createHash('sha256').update(b).digest('hex').slice(0,16),filename='mesh-'+id+'.js';
 if(!files.includes(filename)){fs.writeFileSync(path.join(out,filename),'(window.TRACK2_ASSETS ||= {})['+JSON.stringify(id)+']='+JSON.stringify({vertices:m.vertices,gzip:gzipSync(b,{level:9}).toString('base64'),batches:m.batches||null})+';\n');files.push(filename);}
 catalog[name]={id,file:filename};
}
const runtime=fs.readFileSync(path.join(root,'tools/tracks2/asset-runtime.js'),'utf8');
fs.writeFileSync(path.join(out,'pack.js'),'/* Fixed route geometry; see docs/TRACK2_SOURCES.md for mapped/modelled distinctions. */\nwindow.TRACK2_CATALOG='+JSON.stringify({data,catalog})+';\n'+runtime);
fs.writeFileSync(path.join(out,'files.json'),JSON.stringify(files));
// Remove only obsolete generated mesh files, never user assets.
for(const f of fs.readdirSync(out))if(/^mesh-[a-f0-9]{16}\.js$/.test(f)&&!files.includes(f))fs.unlinkSync(path.join(out,f));
console.log('Packed',Object.keys(catalog).length,'routes in',files.length,'immutable assets.');
