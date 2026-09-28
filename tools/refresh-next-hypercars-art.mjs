import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {NEXT_CABINS} from './road-hypercars/next-cabins.mjs';
import {NEXT_ENGINES} from './road-hypercars/next-engines.mjs';
import {drawNextMcf1} from './road-hypercars/next-exteriors.mjs';
import {namespaceMaterials} from './road-hypercars/materials.mjs';
import {replaceBounded,bindings,live,css} from './refresh-road-hypercars-art.mjs';

export const NEXT_CARS={venom:['Hennessey Venom F5','VenomApp'],amgone:['Mercedes-AMG One','AmgOneApp'],aston:['Aston Martin Valkyrie','AstonApp'],mcf1:['McLaren F1 1993','McF1App']};
const root=resolve(import.meta.dirname,'..'),art=resolve(import.meta.dirname,'road-hypercars');
const mirrors=`  // NEXT_REAR_VIEWS:BEGIN
  let rearLayoutCache=null;
  function drawMirrors(w,h,pal){
    // Permanent independent views, anchored outside the forward road corridor.
    const driving=document.body.classList.contains('view-drive');
    if(rearLayoutCache?.w!==w||rearLayoutCache?.h!==h||rearLayoutCache?.driving!==driving){
      const margin=Math.max(12,w*.025),baseWidth=Math.min(190,w*(h<520?.15:w<600?.23:.17)),preferredY=h*(w<600?.48:.56);
      // Fit the bezel and label around the actual 1.0 controls. Only measure on resize
      // or view changes, never in the per-frame projection work.
      const obstacles=[...document.querySelectorAll('.topbar,.hud,.bottombar,.mobile-pad,.touch-wheel,.drive-help')].filter(e=>e.checkVisibility()).map(e=>e.getBoundingClientRect());
      obstacles.push({left:w*.4,right:w*.6,top:h*.46,bottom:h*.66});
      let views;
        for(const factor of [1,.85,.7,.55]){
          const mw=baseWidth*factor,mh=mw*.54;
          const ys=[preferredY,14,...obstacles.flatMap(r=>[r.bottom+14,r.top-mh-24])];
          const pairs=[];
          for(const y of ys){
            const pair=[0,1].map(side=>{
              const preferredX=side?w-margin-mw:margin;
              const xs=[preferredX,side?w/2+12:w/2-mw-12,...obstacles.map(r=>side?r.left-mw-14:r.right+14)];
              return xs.filter(x=>{
                const b={left:x-7,right:x+mw+7,top:y-7,bottom:y+mh+17};
                return b.left>=0&&b.right<=w&&b.top>=0&&b.bottom<=h&&(side?b.left>=w/2+5:b.right<=w/2-5)&&!obstacles.some(r=>b.left<r.right&&b.right>r.left&&b.top<r.bottom&&b.bottom>r.top);
              }).map(x=>({x,y,w:mw,h:mh,score:Math.abs(x-preferredX)*2+Math.abs(y-preferredY)})).sort((a,b)=>a.score-b.score)[0];
            });
            if(pair.every(Boolean))pairs.push(pair);
          }
          if(pairs.length){views=pairs.sort((a,b)=>a[0].score+a[1].score-b[0].score-b[1].score)[0];break;}
        }
      views??=[0,1].map(side=>({x:side?w-margin-baseWidth:margin,y:preferredY,w:baseWidth,h:baseWidth*.54}));
      rearLayoutCache={w,h,driving,views};
    }
    app.rearViews=[];ctx.save();const ratio=canvas.width/w;ctx.setTransform(ratio,0,0,ratio,0,0);
    MIRROR.pods.forEach((p,i)=>{
      const {x,y,w:mw,h:mh}=rearLayoutCache.views[i];
      drawRearView(x,y,mw,mh,p,pal);app.rearViews.push({x,y,w:mw,h:mh,eye:p.eye,yaw:p.yaw});
      const display=document.getElementById(i===0?'rhRearLeft':'rhRearRight');
      if(display&&document.body.classList.contains('view-cockpit'))display.getContext('2d').drawImage(canvas,x*ratio,y*ratio,mw*ratio,mh*ratio,0,0,display.width,display.height);
    });ctx.restore();
  }
  // NEXT_REAR_VIEWS:END

`;
function injectBlock(s,start,end,body,anchor){return s.includes(start)?replaceBounded(s,start,end,body.slice(0,body.indexOf(end))):s.replace(anchor,anchor+'\n'+body);}
export function refreshNextHypercars(){
for(const [key,[name]] of Object.entries(NEXT_CARS)){
 const file=resolve(root,name+' simulator.html');let s=readFileSync(file,'utf8');
 let cabin=NEXT_CABINS[key]().replace(/data-control="__(\w+)"/g,'data-cabin-action="$1"');
 cabin=cabin.replace('</svg>','<rect class="rhCabinGlow" width="1000" height="520" fill="#ffe0a5"/></svg>');
 const marker='    app.el.cabinArt.innerHTML = `',a=s.indexOf(marker,s.indexOf('  function injectArt()')),z=s.indexOf('`;',a+marker.length);
 if(a<0||z<0)throw Error(name+' missing cabin boundary');
 s=s.slice(0,a)+marker+'\n'+namespaceMaterials(cabin,'cab')+'`;'+s.slice(z+2);
 s=replaceBounded(s,'        <div class="engine-bay" id="engineBay">','        <div class="control-grid">',`        <div class="engine-bay" id="engineBay">\n${namespaceMaterials(NEXT_ENGINES[key](),'eng')}\n        </div>\n`);
 const driving=['driving-common.js','next-driving-common.js',key+'-driving.js'].map(f=>readFileSync(resolve(art,f),'utf8')).join('');
 s=replaceBounded(s,s.includes('  // Drawing primitives only;')?'  // Drawing primitives only;':'  function drawCabinFrame','  function drawHeadlights',driving);
 s=injectBlock(s,'    // ROAD_ART_BINDINGS:BEGIN','    // ROAD_ART_BINDINGS:END',bindings,'  function bindCockpit() {');
 // Add the same live drawing bindings without changing the first five cars.
 let extra=live.replace('velocityBtn:state.velocity,','velocityBtn:state.velocity,drsBtn:state.drs,fuelBtn:state.e85,hybridBtn:state.hybrid,raceAeroBtn:state.raceAero,').replace("put('rhWater'", "put('rhOil',Math.round(state.oilTempC)+'°C');put('rhWater'");
 s=injectBlock(s,'      // ROAD_ART_LIVE:BEGIN','      // ROAD_ART_LIVE:END',extra,'      num("cabRpmArt", state.rpm);');
 const nextCss=css.replace('@media(max-width:600px),(max-width:1040px) and (max-height:520px){','@media(max-width:1040px){');
 if(s.includes('    /* ROAD_ART_CSS:BEGIN */'))s=replaceBounded(s,'    /* ROAD_ART_CSS:BEGIN */','    /* ROAD_ART_CSS:END */',nextCss.slice(nextCss.indexOf('    /* ROAD_ART_CSS:BEGIN */'),nextCss.indexOf('    /* ROAD_ART_CSS:END */')));
 else s=s.replace('  </style>',nextCss+'  </style>');
 if(key==='aston'&&!s.includes('.amr-pro .road-variant-art{'))s=s.replace('  </style>','    .amr-pro .road-variant-art{display:none}\n  </style>');
 if(key==='aston'||key==='mcf1'){
  const config={style:'side',frame:'screen',tint:key==='aston'?'#829b8e':'#8d9799',flank:key==='aston'?'#315d58':'#899da8',label:'REAR',pods:[{eye:-.92,yaw:-.30},{eye:.92,yaw:.30}]};
  s=s.replace(/  const MIRROR = [^\n]+;/,'  const MIRROR = '+JSON.stringify(config)+';');
  const start=s.includes('  // NEXT_REAR_VIEWS:BEGIN')?'  // NEXT_REAR_VIEWS:BEGIN':'  function drawMirrors(';
  s=replaceBounded(s,start,'  // Drawing primitives only;',mirrors);
 }
 if(key==='mcf1'){
  // This individually drawn car is deliberately excluded from the general bodykit generator.
  const exteriorMarker='    app.el.exteriorArt.innerHTML = `',e=s.indexOf(exteriorMarker,s.indexOf('  function injectExterior()')),end=s.indexOf('`;',e+exteriorMarker.length);
  if(e<0||end<0)throw Error('Missing McLaren F1 exterior');
  s=s.slice(0,e)+exteriorMarker+'\n'+drawNextMcf1()+'\n    `;'+s.slice(end+2);
  s=s.replace('McLaren F1 cockpit SVG — digital GR cluster, round GR wheel, F1 Command touchscreen','McLaren F1: central analog instruments, simple Nardi wheel and manual gear lever; requested simulator rear-camera displays');
 }
 if(key==='amgone')s=s.replace('Engine cover raised — the F163CF on show.','Engine cover raised — the F1-derived V6 and hybrid hardware on show.');
 s=s.replace(/(<div class="tw-hub">)[^<]+/, '$1'+({venom:'F5',amgone:'AMG',aston:'AM',mcf1:'F1'}[key]));
 writeFileSync(file,s);console.log('Refreshed '+name+' — individual 1.0 art');
}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))refreshNextHypercars();
