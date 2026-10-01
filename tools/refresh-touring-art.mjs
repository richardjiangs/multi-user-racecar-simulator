import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {TOURING_CABINS} from './road-hypercars/touring-cabins.mjs';
import {TOURING_ENGINES} from './road-hypercars/touring-engines.mjs';
import {namespaceMaterials} from './road-hypercars/materials.mjs';
import {replaceBounded,bindings,live,css} from './refresh-road-hypercars-art.mjs';
import {mirrors} from './refresh-next-hypercars-art.mjs';
export const TOURING_CARS={mclaren:['McLaren Speedtail simulator.html','McLarenApp'],pagani:['Pagani Huayra BC Simulator.html','PaganiApp'],zr1:['Chevrolet Corvette ZR1 simulator.html','Zr1App'],gto:['Ferrari 250 GTO simulator.html','GtoApp'],f40:['Ferrari F40 simulator.html','F40App'],p917:['Porsche 917 simulator.html','P917App']};
const root=resolve(import.meta.dirname,'..'),art=resolve(import.meta.dirname,'road-hypercars');
function block(s,start,end,body,anchor){return s.includes(start)?replaceBounded(s,start,end,body.slice(body.indexOf(start),body.indexOf(end))):s.replace(anchor,anchor+'\n'+body);}
export function refreshTouringArt(){for(const [key,[name]] of Object.entries(TOURING_CARS)){
 const file=resolve(root,name);let s=readFileSync(file,'utf8');
 let cabin=TOURING_CABINS[key]().replace(/data-control="__(\w+)"/g,'data-cabin-action="$1"').replace('</svg>','<rect class="rhCabinGlow" width="1000" height="520" fill="#ffe0a5"/></svg>');
 cabin=cabin.replace(/(id="cabRevNeedle"[^>]*data-max=")([\d.]+)(")/,(_,a,max,z)=>a+(Number(max)<=10?Number(max)*1000:Number(max)*100)+z);
 const marker='    app.el.cabinArt.innerHTML = `',a=s.indexOf(marker,s.indexOf('  function injectArt()')),z=s.indexOf('`;',a+marker.length);if(a<0||z<0)throw Error(name+' missing cabin boundary');
 s=s.slice(0,a)+marker+'\n'+namespaceMaterials(cabin,'cab')+'`;'+s.slice(z+2);
 s=replaceBounded(s,'        <div class="engine-bay" id="engineBay">','        <div class="control-grid">',`        <div class="engine-bay" id="engineBay">\n${namespaceMaterials(TOURING_ENGINES[key](),'eng')}\n        </div>\n`);
 const driving=['driving-common.js','next-driving-common.js','touring-driving-common.js',key+'-driving.js'].map(f=>readFileSync(resolve(art,f),'utf8')).join('');
 s=replaceBounded(s,s.includes('  // Drawing primitives only;')?'  // Drawing primitives only;':'  function drawCabinFrame','  function drawHeadlights',driving);
 const touringBindings=bindings.replace("n.dataset.cabinAction==='temperature'","['temperature','temperatureDown'].includes(n.dataset.cabinAction)").replace('(e.shiftKey?-1:1)',"(n.dataset.cabinAction==='temperatureDown'||e.shiftKey?-1:1)");
 s=block(s,'    // ROAD_ART_BINDINGS:BEGIN','    // ROAD_ART_BINDINGS:END',touringBindings,'  function bindCockpit() {');
 let extra=live.replace('velocityBtn:state.velocity,','velocityBtn:state.velocity,fuelBtn:state.e85,corsaBtn:state.corsa,');
 extra=extra.replace('      // ROAD_ART_LIVE:END',`      for(const n of el.cabinArt.querySelectorAll('[data-live-needle]')){
        const fraction=clamp((state[n.dataset.liveNeedle]||0)/Number(n.dataset.max),0,1);
        n.setAttribute('transform','rotate('+(-130+260*fraction).toFixed(1)+','+n.dataset.cx+','+n.dataset.cy+')');
      }
      el.engineBay.style.setProperty('--tc-crank-fan',((state.ignition?state.time*state.rpm*.7:0)%360)+'deg');
      // ROAD_ART_LIVE:END`);
 s=block(s,'      // ROAD_ART_LIVE:BEGIN','      // ROAD_ART_LIVE:END',extra,'      num("cabRpmArt", state.rpm);');
 s=s.replace('sweep("cabRevNeedle", rev);','sweep("cabRevNeedle", state.rpm / (Number(document.getElementById("cabRevNeedle")?.dataset.max) || SPEC.redlineRpm));');
 const tcCss=css.replace('@media(max-width:600px),(max-width:1040px) and (max-height:520px){','@media(max-width:1040px){');
 s=s.replace(/\n*    \/\* ROAD_ART_CSS:BEGIN \*\/[\s\S]*?    \/\* ROAD_ART_CSS:END \*\/\n?/, '');
 s=s.replace('  </style>',tcCss+'  </style>');
 if(key==='mclaren'){
  s=s.replace(/  const MIRROR = [^\n]+;/,'  const MIRROR = '+JSON.stringify({style:'side',frame:'screen',tint:'#8aadb7',flank:'#6b959e',label:'CAM',pods:[{eye:-.8,yaw:-.34},{eye:.8,yaw:.34}]})+';');
  s=replaceBounded(s,s.includes('  // NEXT_REAR_VIEWS:BEGIN')?'  // NEXT_REAR_VIEWS:BEGIN':'  function drawMirrors(','  // Drawing primitives only;',mirrors);
 }
 if(key==='pagani')s=s.replace('Cognac leather, exposed aluminium, jewelled toggles','Blue leather, woven carbon, machined instruments and exposed selector');
 const mark={mclaren:'McL',pagani:'BC',zr1:'ZR1',gto:'250',f40:'F40',p917:'917'}[key];s=s.replace(/(<div class="tw-hub">)[^<]+/,'$1'+mark);
 writeFileSync(file,s);console.log('Refreshed '+name+' — individually drawn 1.0 art');
}}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))refreshTouringArt();
