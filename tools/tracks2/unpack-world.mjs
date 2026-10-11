// Restore exported mesh intermediates from the current immutable pack for selective rebuilds.
import {decodeMesh} from './mesh-codec.mjs';
import fs from 'node:fs';import vm from 'node:vm';import {gunzipSync} from 'node:zlib';
const dir=process.argv[2]||'/tmp/track2-world-final',env={window:{},console,document:{currentScript:{src:''}},location:{href:''}};vm.createContext(env);
const source=fs.readFileSync('assets/tracks-2/pack.js','utf8'),end=source.indexOf(';\n',source.indexOf('window.TRACK2_CATALOG='));vm.runInContext(source.slice(0,end+1),env);
fs.mkdirSync(dir,{recursive:true});const index={};let i=0;for(const[name,c]of Object.entries(env.window.TRACK2_CATALOG.catalog)){vm.runInContext(fs.readFileSync('assets/tracks-2/'+c.file,'utf8'),env);const m=env.window.TRACK2_ASSETS[c.id],file='mesh-'+i+++'.bin';fs.writeFileSync(dir+'/'+file,decodeMesh(gunzipSync(Buffer.from(m.gzip,'base64')),m.codec,m.vertices));index[name]={file,vertices:m.vertices,batches:m.batches};delete env.window.TRACK2_ASSETS[c.id];}fs.writeFileSync(dir+'/mesh-index.json',JSON.stringify(index));fs.copyFileSync('tools/tracks2/track-data.json',dir+'/track-data.json');console.log('Restored',i,'meshes');
