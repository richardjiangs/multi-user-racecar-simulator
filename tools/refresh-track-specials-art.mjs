// Run after editing draw-track-specials.mjs. This refreshes artwork without touching
// the controls, physics, sound or live-instrument integration in each simulator.
import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
for(const [key,file,card] of [['viper','Dodge Viper ACR Extreme Aero','viperacr'],['mcx','Maserati MCXtrema','mcxtrema'],['peugeot','Peugeot 9X8','peugeot9x8'],['zenvo','Zenvo Aurora Agil','aurora']]){
 const art=kind=>readFileSync(new URL(`track-specials-art/${key}-${kind}.svg`,import.meta.url),'utf8');
 let s=readFileSync(new URL(file+' simulator.html',root),'utf8');
 for(const [pattern,value] of [[/const HAND_COCKPIT = `[\s\S]*?`;/,'const HAND_COCKPIT = `'+art('cockpit')+'`;'],[/app\.el\.exteriorArt\.innerHTML=`[\s\S]*?`;/,'app.el.exteriorArt.innerHTML=`'+art('exterior')+'`;'],[/app\.el\.engineBay\.innerHTML=`[\s\S]*?`;/,'app.el.engineBay.innerHTML=`'+art('engine')+'<div class="cover" id="engineCover">BODYWORK CLOSED</div>`;']]){
  if(!pattern.test(s))throw Error('Missing embedded art '+file);s=s.replace(pattern,()=>value);
 }
 writeFileSync(new URL(file+' simulator.html',root),s);
 let index=readFileSync(new URL('index.html',root),'utf8'),a=index.indexOf('data-car-card="'+card+'"'),b=index.indexOf('<svg',a),e=index.indexOf('</svg>',b)+6;
 const exterior=art('exterior').replace(/id="([^"]+)"/g,(_,id)=>`id="card-${key}-${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#card-${key}-${id})`);
 index=index.slice(0,b)+exterior+index.slice(e);writeFileSync(new URL('index.html',root),index);
}
