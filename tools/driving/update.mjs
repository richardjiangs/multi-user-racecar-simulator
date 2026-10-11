import fs from 'node:fs';import './controls.js';
const manifest=JSON.parse(fs.readFileSync('tools/tracks2/manifest.json'));
for(const [key,file] of Object.entries(manifest))fs.writeFileSync(file,MUCSDriving.prepare(fs.readFileSync(file,'utf8'),key));
console.log('Applied steering-only assist and one-second trackpad controls to',Object.keys(manifest).length,'Track 2.0 files');
