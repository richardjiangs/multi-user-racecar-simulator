// Render all authored wheel geometries together before integrating the driving view.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(process.env.CODEX_NODE_MODULES+'/package.json');
const {chromium}=require('playwright');
const profiles=fs.readFileSync('tools/f1-2026/wheel-profiles.js','utf8');
const art=fs.readFileSync('tools/f1-2026/wheel-art.js','utf8');
const keys=['redbull','ferrari','mclaren','aston','alpine','williams','racingbulls','haas','audi','cadillac'];
const panels=[];
for(const short of keys){
 const key='f1'+short,app={},env={window:{__Track2App:app},TRACK2_CONFIG:{key}};
 vm.createContext(env);vm.runInContext(profiles+'\n'+art,env);
 const svg=app.f1WheelSvg(true);
 if(/NaN|undefined/.test(svg))throw Error('Invalid drawing '+key);
 const outline=app.f1ArtProfile.outline;
 if(!/^[Mm]/.test(outline)||/[a-z]{3}/i.test(outline))throw Error('Invalid contour '+key);
 panels.push(`<article><h2>${app.f1ArtProfile.mark} · ${app.f1ArtProfile.model}</h2>${svg}</article>`);
}
const html=`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#111a20;color:#dfe9ee;font:14px Arial;display:grid;grid-template-columns:repeat(2,600px)}article{border:1px solid #263944;padding:16px}h2{font-size:14px;letter-spacing:2px;margin:0}svg{width:100%;height:350px}</style>${panels.join('')}`;
const dir=path.resolve('tests/track2/art-review');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'wheels.html'),html);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true});
try{const page=await browser.newPage({viewport:{width:1200,height:800}});await page.goto('file://'+path.join(dir,'wheels.html'));await page.screenshot({path:path.join(dir,'wheels.png'),fullPage:true});console.log('Rendered 10 distinct wheel contours for visual review');}
finally{await browser.close();}
