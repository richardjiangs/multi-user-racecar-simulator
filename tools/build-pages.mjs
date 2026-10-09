// Deployment output excludes research caches and tests, retains every original
// HTML simulator, and builds the large offline files outside Git's file limit.
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'_site');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const entry of fs.readdirSync(root,{withFileTypes:true})){
 const name=entry.name;if(name==='sims-embedded.js')continue; // file:// folder fallback; hosted offline use is index-offline.html
 if(entry.isDirectory()){if(['assets','vendor','docs'].includes(name))fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});continue;}
 if(/\.(html|js|b64|txt)$/.test(name)||['.nojekyll','LICENSE'].includes(name))fs.copyFileSync(path.join(root,name),path.join(out,name));
}
let bytes=0;function size(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())size(p);else bytes+=fs.statSync(p).size;}}size(out);
if(bytes>1e9)throw Error('Pages output exceeds the published-site 1 GB limit: '+bytes);
console.log('Pages output: '+(bytes/1e6).toFixed(1)+' MB; original and Track 2.0 simulators retained.');
