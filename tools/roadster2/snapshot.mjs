// Capture the generated Roadster source directly, so a stale embedded bundle
// cannot be recorded with the new source's checksum.
import fs from 'node:fs';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';
const require=createRequire((process.env.CODEX_NODE_MODULES||'/Users/daisy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/package.json');const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath()});
try{const page=await browser.newPage();await page.goto((process.env.BASE_URL||'http://127.0.0.1:8000/')+encodeURIComponent('Tesla Roadster 2 simulator.html'));await page.waitForFunction(()=>window.RoadsterApp?.roadsterExteriorSVG);
const value=await page.evaluate(()=>{const a=RoadsterApp;a.setView('exterior');a.roadsterRefreshArt();const svg=a.el.exteriorArt.querySelector('svg').cloneNode(true);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.style.setProperty('--wheel-rot','0deg');svg.style.width='100%';svg.style.height='100%';return{svg:svg.outerHTML,routes:[...document.querySelectorAll('[data-circuit]')].map(e=>e.dataset.circuit)};});
const json=JSON.parse(fs.readFileSync('tools/offline/exteriors.json','utf8'));json.roadster2={...value,sourceHash:createHash('sha256').update(fs.readFileSync('Tesla Roadster 2 simulator.html')).digest('hex')};fs.writeFileSync('tools/offline/exteriors.json',JSON.stringify(json));
console.log('Roadster artwork snapshot: '+value.svg.length+' bytes; online homepage photo preserved.');
}finally{await browser.close();}
