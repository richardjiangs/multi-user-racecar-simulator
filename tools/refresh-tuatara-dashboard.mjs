import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const path = resolve(import.meta.dirname,'../SSC Tuatara simulator.html');
let src=readFileSync(path,'utf8');
let svg=readFileSync(resolve(import.meta.dirname,'tuatara-dashboard.svg'),'utf8');
svg=svg.replace('__TACH_SEGMENTS__',Array.from({length:32},(_,i)=>{
  const a=Math.PI*(1.05+i/31*.84),x=279+108*Math.cos(a),y=193+58*Math.sin(a);
  return `<rect x="-2.6" y="-6" width="5.2" height="12" fill="#2c383f" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(a*180/Math.PI+90).toFixed(2)})"/>`;
}).join(''));
svg=svg.replace('__SHIFT_LIGHTS__',Array.from({length:6},(_,i)=>`<rect x="${i*10}" width="7" height="4" rx="1" fill="#45392d"/>`).join(''));
src=src.replace(/(    app\.el\.cabinArt\.innerHTML = `)[\s\S]*?(`;\n  \}\n  function weave)/,(_,a,b)=>a+'\n'+svg+'\n  '+b);
const canvas=readFileSync(resolve(import.meta.dirname,'tuatara-driving-dashboard.js'),'utf8');
const start=src.indexOf('  // instantaneous output (hp)');
const currentStart=start>=0?start:src.indexOf('  // Production Tuatara:');
const end=src.indexOf('  function drawHeadlights',currentStart);
if(currentStart<0||end<0)throw Error('Tuatara dashboard markers missing');
src=src.slice(0,currentStart)+canvas+src.slice(end);
src=src.replace(/    \/\/ ---- Tuatara cluster:[\s\S]*?drawCluster\(w, h, dashY, sway\);\n        drawWheel\(w, h\);/, '    drawCluster(w, h, dashY, sway);\n    drawWheel(w, h);');
src=src.replace(/const dashY = h \* (?:0\.66|0\.73|0\.70) \+ sway \* 0\.2;/, 'const dashY = h * 0.70 + sway * 0.2;');
if(!src.includes('// SSC production touchscreen bindings'))src=src.replace('  function bindCockpit() {',`  function bindCockpit() {
    // SSC production touchscreen bindings use the existing vehicle controls.
    const activate = e => {
      const control = e.target.closest('[data-control]'); if (!control) return;
      if (e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      if (!e.repeat) document.getElementById(control.dataset.control)?.click();
    };
    el.cabinArt.addEventListener('click', activate);
    el.cabinArt.addEventListener('keydown', activate);`);
if(!src.includes('// SSC live touchscreen'))src=src.replace('      num("cabRpmArt", state.rpm);',`      num("cabRpmArt", state.rpm);
      // SSC live touchscreen and driver HMI.
      put("sscBoostArt", (state.boostBar || 0).toFixed(1) + " BAR");
      put("sscOilArt", String(Math.round(state.oilTempC)));
      put("sscWaterArt", Math.round(state.waterTempC) + "°C");
      put("sscModeArt", state.driveMode.toUpperCase());
      put("sscFuelArt", state.e85 ? "E85" : "91 OCT");
      for (const node of document.querySelectorAll('#cabinArt [data-control]')) {
        const active = {liftBtn: state.rideHeight === 1, coolBtn: state.cool, audioBtn: state.audioCabin, startSwitchBtn: state.ignition}[node.dataset.control];
        if (active !== undefined) node.setAttribute('aria-pressed', String(active));
      }
      document.querySelectorAll('#sscShiftLights rect').forEach((node,i)=>node.setAttribute('fill',state.ignition && rev > .65+i*.05 ? (i<4?'#f8bf57':'#fb5447'):'#45392d'));`);
writeFileSync(path,src);
console.log('SSC production dashboard refreshed: driving view and interactive cabin');
