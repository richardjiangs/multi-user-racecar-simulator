import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {CABINS} from './road-hypercars/cabins.mjs';
import {ENGINES} from './road-hypercars/engines.mjs';
import {namespaceMaterials} from './road-hypercars/materials.mjs';

export const CARS={bugatti:['Bugatti Chiron Super Sport 300+','BugattiApp'],koenigsegg:['Koenigsegg Jesko','KoenigseggApp'],p1:['McLaren P1','P1App'],ferrari:['Ferrari F80','FerrariApp'],alfa33:['Alfa Romeo 33 Stradale','Alfa33App']};
const root=resolve(import.meta.dirname,'..'),art=resolve(import.meta.dirname,'road-hypercars');
export function replaceBounded(s,start,end,body){const a=s.indexOf(start),b=s.indexOf(end,a);if(a<0||b<0)throw Error('Missing boundary: '+start);return s.slice(0,a)+body+s.slice(b);}
export const bindings=`    // ROAD_ART_BINDINGS:BEGIN
    // Drawn controls invoke existing actions; no powertrain or sound model lives here.
    const activateCabin = e => {
      const n=e.target.closest('[data-control],[data-cabin-action]'); if(!n)return;
      if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;
      e.preventDefault();e.stopPropagation();if(e.repeat)return;
      if(n.dataset.control==='hornBtn') { app.hornOn();setTimeout(()=>app.hornOff(),180); }
      else if(n.dataset.control)document.getElementById(n.dataset.control)?.click();
      else if(n.dataset.cabinAction==='neutral')app.setGear('N');
      else if(n.dataset.cabinAction==='reverse')app.setGear('R');
      else if(n.dataset.cabinAction==='temperature') {
        state.cabinSetpoint=(state.cabinSetpoint??22)+(e.shiftKey?-1:1);
        if(state.cabinSetpoint>26)state.cabinSetpoint=18;if(state.cabinSetpoint<18)state.cabinSetpoint=26;
        app.showToast('Climate set to '+state.cabinSetpoint+'°C. Shift-click to turn the dial down.','Climate');
      }
      else if(n.dataset.cabinAction==='fan') {
        state.cabinFanLevel=((state.cabinFanLevel??2)+1)%6;
        if(!!state.cool!==(state.cabinFanLevel>0))app.setToggle('cool',state.cabinFanLevel>0);
        app.showToast(state.cabinFanLevel?'Cabin fan · level '+state.cabinFanLevel:'Cabin fan off.','Climate');
      }
      else if(n.dataset.cabinAction==='climateAuto') {
        state.cabinClimateAuto=!(state.cabinClimateAuto??true);
        if(state.cabinClimateAuto&&!state.cool)app.setToggle('cool',true);
        app.showToast(state.cabinClimateAuto?'Automatic climate selected.':'Manual climate selected.','Climate');
      }
      else if(n.dataset.cabinAction==='ipas') {
        state.cabinHybridPage=!state.cabinHybridPage;
        app.showToast(state.cabinHybridPage?'IPAS: hybrid output is included in the existing throttle model. Power readout selected.':'Instrument readout selected.','McLaren P1');
      }
      app.updateUi();
    };
    el.cabinArt.addEventListener('click',activateCabin);
    el.cabinArt.addEventListener('keydown',activateCabin);
    // ROAD_ART_BINDINGS:END
`;
export const live=`      // ROAD_ART_LIVE:BEGIN
      put('rhWater',Math.round(state.waterTempC)+'°C');
      put('rhBoost',(state.boostBar||0).toFixed(1));
      put('rhTempSet',(state.cabinSetpoint??22)+'°');put('rhFanSet','FAN '+(state.cabinFanLevel??2));put('rhClimateAuto',(state.cabinClimateAuto??true)?'AUTO':'MAN');
      if(document.getElementById('rhTempSet'))el.climateRead.textContent=(state.cabinSetpoint??22)+'°C';
      const output=Math.round(app.engineTorque(state.rpm)*state.rpm*Math.PI/30*state.throttle/735.5);
      put('rhPower',String(output));
      put('rhMode',document.getElementById('pistaBtn')?(state.pista?'PISTA':'STRADA'):state.driveMode.toUpperCase());
      if(document.getElementById('pistaBtn'))el.modeReadCab.textContent=state.pista?'Pista':'Strada';
      const selfLevel=document.getElementById('jeskoLevelArt');
      if(selfLevel)selfLevel.setAttribute('transform','rotate('+(-state.steer*52).toFixed(1)+')');
      const jeskoRev=document.getElementById('rhJeskoRev');if(jeskoRev)jeskoRev.setAttribute('width',String(74*rev));
      document.querySelectorAll('#rhShiftLights rect').forEach((n,i)=>n.setAttribute('fill',state.ignition&&rev>.6+i*.045?(i<6?'#efd978':'#ff4948'):'#34332a'));
      for(const n of el.cabinArt.querySelectorAll('[data-control]')) {
        const on={startSwitchBtn:state.ignition,coolBtn:state.cool,heatBtn:state.heat,audioBtn:state.audioCabin,ambientBtn:state.ambient,lightsBtn:state.lights,liftBtn:state.rideHeight===1,doorAllBtn:app.anyDoorOpen(),escBtn:state.esc,speedKeyBtn:state.speedKey,velocityBtn:state.velocity,pistaBtn:state.pista,dataBtn:state.dataHud}[n.dataset.control];
        if(on!==undefined)n.setAttribute('aria-pressed',String(on));
      }
      const hybridPage=document.getElementById('rhHybridPage');
      if(hybridPage){hybridPage.setAttribute('visibility',state.cabinHybridPage?'visible':'hidden');put('rhHybridPower',String(output)+' PS');}
      el.cabinArt.classList.toggle('rh-cabin-lit',!!state.ambient);
      el.exteriorArt.classList.toggle('rh-lights',!!state.lights);
      el.engineBay.classList.toggle('is-open',!!state.engineCoverOpen);
      el.engineBay.style.setProperty('--rh-fan',((state.coolingFans?state.time:0)*420%360)+'deg');
      document.getElementById('coverBtn').textContent=state.engineCoverOpen?'Close Cover':'Open Cover';
      // ROAD_ART_LIVE:END
`;
export const css=`
    /* ROAD_ART_CSS:BEGIN */
    #cabinArt {background:#091219;}
    #cabinArt svg {isolation:isolate;}
    #cabinArt .rhCabinGlow {opacity:0;transition:opacity .35s;pointer-events:none;}
    #cabinArt.rh-cabin-lit .rhCabinGlow {opacity:.1;}
    #engineBay {height:auto;aspect-ratio:900/520;background:#071019;}
    #engineBay>svg {display:block;width:100%;height:100%;}
    #engineBay .cover {inset:auto 7px 7px auto;width:auto;height:auto;padding:4px 7px;font:9px Arial;letter-spacing:1px;border:1px solid #465965;border-radius:3px;background:#08131c;transform:none;pointer-events:none;}
    #cabinArt [role=button]:focus-visible {outline:2px solid #92d8ef;outline-offset:2px;}
    body:not(.view-drive) .mobile-pad,body:not(.view-drive) .touch-wheel{display:none;}
    @media(max-width:1040px){
      .topbar{padding:6px;gap:5px;}
      .brand{padding:7px 10px;min-height:0;}.brand p{display:none;}.brand .mark{height:28px;width:28px;margin-right:8px;}.brand h1{font-size:14px;line-height:28px;}
      .tabs,.quick{padding:5px;gap:4px;flex-wrap:nowrap;overflow-x:auto;}.tabs button{flex:1 0 auto;min-width:52px;font-size:10px;padding:7px 6px;}.quick button{flex:1 0 auto;min-width:44px;font-size:10px;padding:7px 6px;}
      .bottombar{gap:4px;padding:0 6px 6px;}.console,.gearbox,.telepad{padding:5px;gap:5px;}
      .console{grid-template-columns:repeat(5,minmax(0,1fr));}.console button{padding:7px 3px;font-size:10px;min-height:30px;}
      .gearbox .cluster{grid-template-columns:repeat(2,34px);gap:3px;}.gearbox .cluster button{min-height:26px;padding:3px;}
      .pedal{min-height:45px;padding:4px 6px;gap:3px;}.gforce{height:34px;}.telepad .small{font-size:9px;}.tele-actions{grid-template-columns:repeat(3,36px);gap:3px;}.tele-actions button{padding:5px 2px;font-size:10px;}
      .mobile-pad{bottom:calc(var(--rh-footer-height,215px) + 14px);left:7px;}.mobile-pad button{min-width:48px;min-height:44px;padding:8px;}
      .touch-wheel{bottom:calc(var(--rh-footer-height,215px) + 14px);right:7px;width:94px;height:94px;}
      .mode-panel{max-height:min(66vh,calc(100dvh - var(--rh-footer-height,215px) - var(--rh-header-height,150px) - 20px));padding:10px;}
    }
    @media(max-width:1040px) and (max-height:520px){
      .topbar{grid-template-columns:1fr 1fr;}.brand{display:none;}.bottombar{grid-template-columns:1fr 1fr 1fr;}.console{grid-template-columns:repeat(3,1fr);}.pedals{grid-template-columns:1fr;}.pedal{min-height:24px;padding:2px;}.pedal i{display:none;}.touch-wheel{width:72px;height:72px;}
    }
    @media(max-width:600px),(max-width:1040px) and (max-height:520px){
      .hud{top:8px;left:8px;width:110px;padding:7px;}.hud .speed{font-size:30px;}.hud .unit{font-size:8px;margin:3px 0 0;}.hud .gear-tile{width:29px;height:29px;font-size:18px;}.hud .speed-row{gap:5px;}
      .hud .meter-grid,.hud .aero-row,.hud .warning{display:none;}
    }
    /* ROAD_ART_CSS:END */
`;

export function refreshRoadHypercars(){
for(const [key,[name]] of Object.entries(CARS)){
 const file=resolve(root,name+' simulator.html');let s=readFileSync(file,'utf8');
 let cabin=CABINS[key]().replace(/data-control="__(\w+)"/g,'data-cabin-action="$1"');
 cabin=cabin.replace('</svg>','<rect class="rhCabinGlow" width="1000" height="520" fill="#ffe0a5"/></svg>');
 if(key==='p1')cabin=cabin.replace('IPAS — blip the existing throttle response','IPAS hybrid readout').replace('</svg>',`<g id="rhHybridPage" visibility="hidden" pointer-events="none"><rect x="390" y="162" width="45" height="67" fill="#06111a"/><text x="412" y="182" text-anchor="middle" font-size="7" fill="#efb567">IPAS</text><text id="rhHybridPower" x="412" y="205" text-anchor="middle" font-size="10" fill="#e1e9ec">0 PS</text><text x="412" y="219" text-anchor="middle" font-size="5" fill="#b7c7cc">THROTTLE</text></g></svg>`);
 cabin=namespaceMaterials(cabin,'cab');
 const marker='    app.el.cabinArt.innerHTML = `';const a=s.indexOf(marker,s.indexOf('  function injectArt()')),z=s.indexOf('`;',a+marker.length);
 if(a<0||z<0)throw Error(name+' missing cockpit');
 s=s.slice(0,a)+marker+'\n'+cabin+'`;'+s.slice(z+2);
 const engine=namespaceMaterials(ENGINES[key](),'eng');
 s=replaceBounded(s,'        <div class="engine-bay" id="engineBay">','        <div class="control-grid">',`        <div class="engine-bay" id="engineBay">\n${engine}\n        </div>\n`);
 const driving=readFileSync(resolve(art,'driving-common.js'),'utf8')+readFileSync(resolve(art,key+'-driving.js'),'utf8');
 const dStart=s.includes('  // Drawing primitives only;')?'  // Drawing primitives only;':'  function drawCabinFrame';
 s=replaceBounded(s,dStart,'  function drawHeadlights',driving);
 if(s.includes('    // ROAD_ART_BINDINGS:BEGIN'))s=replaceBounded(s,'    // ROAD_ART_BINDINGS:BEGIN','    // ROAD_ART_BINDINGS:END',bindings.slice(0,bindings.indexOf('    // ROAD_ART_BINDINGS:END')));
 else s=s.replace('  function bindCockpit() {','  function bindCockpit() {\n'+bindings);
 if(s.includes('      // ROAD_ART_LIVE:BEGIN'))s=replaceBounded(s,'      // ROAD_ART_LIVE:BEGIN','      // ROAD_ART_LIVE:END',live.slice(0,live.indexOf('      // ROAD_ART_LIVE:END')));
 else s=s.replace('      num("cabRpmArt", state.rpm);','      num("cabRpmArt", state.rpm);\n'+live);
 if(s.includes('    /* ROAD_ART_CSS:BEGIN */'))s=replaceBounded(s,'    /* ROAD_ART_CSS:BEGIN */','    /* ROAD_ART_CSS:END */',css.slice(css.indexOf('    /* ROAD_ART_CSS:BEGIN */'),css.indexOf('    /* ROAD_ART_CSS:END */')));
 else s=s.replace('  </style>',css+'  </style>');
 if(key==='p1')s=s.replace('/* McLaren cockpit SVG — CENTRAL driving seat, two passenger benches, three-screen dash */','/* P1 left-hand-drive, two-seat MonoCage: hand-drawn cabin and separate driving fascia. */');
 if(key==='bugatti')s=s.replace('Bicolour leather, milled aluminium centre spine, C-bar','Black Alcantara, orange stitching, analog speedometer, milled centre spine and four climate dials');
 if(key==='koenigsegg')s=s.replace('SmartCluster on the column — it turns with the wheel — SmartCenter touchscreen','Wheel-mounted SmartCluster with self-leveling readouts, SmartWheel touch controls and portrait SmartCenter');
 if(key==='ferrari')s=s.replace('“1+” cockpit — red driver seat, offset passenger, F1-style cluster','Asymmetric “1+” cabin, red driver seat, flat-top/flat-bottom wheel with physical buttons and gated selector');
 if(key==='alfa33'){
  s=s.replace(/(<button id="startSwitchBtn"[^>]*>)[^<]*/, '$1Ignition').replace('The red starter is on the wheel, left spoke','Starter on the aircraft-style centre console');
  // Correct inherited cabin/engine captions, without touching the audio or performance blocks.
  s=s.replace('Two dials under a hooded binnacle, a rotary on the tunnel for Strada/Pista — and no touchscreen anywhere, by design','Telescopic twin-dial instruments, a button-free wheel, retractable centre display and aircraft-style tunnel switches');
  s=s.replaceAll('two modes, and no screen','two modes, tactile controls');
  s=s.replaceAll('Alfa fitted no touchscreen anywhere in this cabin, which is a decision, not an omission.','The central display retracts into the dashboard, keeping the main fascia clear.');
  s=s.replaceAll('Alfa fitted a retractable centre display below the fascia, which is a decision, not an omission.','The central display retracts into the dashboard, keeping the main fascia clear.');
  s=s.replaceAll('and nothing else — The central','and tactile switches. The central');
  s=s.replaceAll('Two modes on the tunnel, no screen anywhere.','Tactile tunnel switches and a button-free steering wheel.');
  s=s.replaceAll('Two modes, and no screen anywhere in this cabin.','Strada selected on the tunnel controls.');
  s=s.replaceAll('has two modes and no touchscreen:','has two driving modes:');
  s=s.replaceAll('and deliberately no screen anywhere','and a retractable centre screen');
  s=s.replaceAll('deliberately no touchscreen anywhere in the cabin.','a retractable centre screen and button-free steering wheel.');
  s=s.replaceAll('There is no third mode and there is no screen','The main driving modes are Strada and Pista');
  s=s.replace('The bonnet lifts — the naturally-aspirated V10 on show.','Rear clamshell raised — the twin-turbo V6 compartment on show.').replace('Bonnet closed.','Rear clamshell closed.');
  s=s.replace('Exhaust flap open — the naturally-aspirated V10 growls and pops.','Exhaust bypass open — full twin-turbo V6 voice.');
  s=s.replace('Overrun map armed — the V10 pops and crackles on a trailing throttle (Track).','Overrun map armed — the V6 responds on a trailing throttle (Pista).');
  s=s.replace('Throttle blip — the V10 spins up smooth and hard.','Throttle blip — the twin-turbo V6 revs rise.').replace('Cold-start flare — the V10 clears its throat to 3,000.','Cold-start flare — the V6 catches behind the cabin.');
  s=s.replace(/  \/\* Alfa Romeo 33 Stradale exterior — side profile[\s\S]*?\*\//,'  /* Modern 33 Stradale: mid-engine proportions, curved canopy, butterfly doors and round rear lamps. */');
 }
 writeFileSync(file,s);console.log('Refreshed '+name+' — 1.0 layout, individual hand-drawn art');
}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))refreshRoadHypercars();
