import fs from 'node:fs';import '../vehicle-refinements/runtime.js';import '../vehicle-refinements/traffic-art.js';import '../vehicle-refinements/db5-art.js';import '../vehicle-refinements/city-network.js';import '../vehicle-refinements/london-data.js';import '../vehicle-refinements/london-map.js';import '../vehicle-refinements/london-sedans.js';import '../vehicle-refinements/prepare.js';import './controls.js';
const manifest=JSON.parse(fs.readFileSync('tools/tracks2/manifest.json'));
for(const [key,file] of Object.entries(manifest))fs.writeFileSync(file,MUCSDriving.prepare(fs.readFileSync(file,'utf8'),key));
console.log('Applied steering-only assist and immediate fullscreen trackpad controls to',Object.keys(manifest).length,'Track 2.0 files');
