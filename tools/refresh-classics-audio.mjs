import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Tone models, not recordings: preserve every vehicle's calibrated powertrain.
export const CLASSIC_VOICES={
 'Ferrari 250 GTO':{saturation:2.15,description:'Colombo V12: six even firing pulses per crank revolution, rounded exhaust harmonics and a rising carburettor bark.',defs:[['sine',1,.42,false],['triangle',1,.30,true],['sawtooth',1.003,.10,true],['triangle',2,.19,true],['sine',3,.13,true],['triangle',4,.055,true]],level:'(0.065 + load * 0.40 + rpmN * 0.16)',cutoff:'500 + s.rpm * 0.40 + load * 2000',intake:'load * (0.006 + rpmN * 0.016)'},
 'Ferrari F40':{saturation:2.6,description:'F120A flat-plane twin-turbo V8: even exhaust pulses, a hard midrange and subdued turbo whistle; no cross-plane lope.',defs:[['sine',1,.30,false],['sawtooth',1,.38,true],['triangle',1.002,.13,true],['triangle',2,.24,true],['sawtooth',3,.085,true],['sine',4,.07,true]],level:'(0.06 + load * 0.39 + rpmN * 0.16)',cutoff:'480 + s.rpm * 0.30 + load * 2300',intake:'clamp(s.boostBar - 0.12, 0, 1.4) * 0.065 * (0.25 + rpmN * 0.75)'},
 'Porsche 917':{saturation:2.9,description:'Naturally aspirated 180-degree V12: six firing pulses per revolution, intake growl and a restrained crank-related cooling-fan tone.',defs:[['sine',1,-.34,false],['sawtooth',1,.40,true],['triangle',1.004,.17,true],['triangle',2,.21,true],['sine',3,.12,true],['triangle',6,.045,true],['sine',7/6,.065,false]],level:'(0.07 + load * 0.38 + rpmN * 0.16)',cutoff:'620 + s.rpm * 0.40 + load * 2300',intake:'load * (0.005 + rpmN * 0.018)'}
};
export function refreshClassicAudio(){
 for(const [name,v] of Object.entries(CLASSIC_VOICES)){
  const file=resolve(import.meta.dirname,'..',name+' simulator.html');let s=readFileSync(file,'utf8');
  s=s.split('      // '+v.description+'\n').join('');
  const a=s.indexOf('      const shaper = c.createWaveShaper();'),b=s.indexOf('      this.oscs = defs.map',a);
  if(a<0||b<0)throw Error(name+' audio boundary');
  const defs=v.defs.map(([type,mul,gain,toShaper])=>'        '+JSON.stringify({type,mul,gain,toShaper})).join(',\n');
  s=s.slice(0,a)+`      // ${v.description}\n      const shaper = c.createWaveShaper();\n      shaper.curve = this._satCurve(${v.saturation});\n      shaper.oversample = "4x";\n      shaper.connect(this.synthGain); // Keep this live: an inline comment once muted the engine's main harmonics.\n      const defs = [\n${defs}\n      ];\n`+s.slice(b);
  s=s.replace(/      const engLevel = [^\n]+/,`      const engLevel = ${v.level} * valve * modeGain;`);
  s=s.replace(/      const cutoff = [^\n]+/,`      const cutoff = ${v.cutoff} + (s.exhaustValve ? 700 : 0);`);
  s=s.replace(/      const turbo = [^\n]+/,`      const turbo = ${v.intake} * (s.exhaustValve ? 1 : 0.8);`);
  s=s.replace(/      const wind = [^\n]+/,'      const wind = clamp((spd - 6) / 70, 0, 1) * (s.windowsOpen ? 0.14 : 0.065);');
  s=s.replace(/      const road = [^\n]+/,'      const road = clamp(spd / 60, 0, 1) * 0.06 * (1 + clamp(s.roadInputG, 0, 1) * 1.2);');
  if(name==='Ferrari F40')s=s.replace('cross-plane V8, two IHI turbos: 4 firing pulses / rev','flat-plane V8, two IHI turbos: 4 firing pulses / rev');
  writeFileSync(file,s);console.log('Restored and voiced '+name);
 }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))refreshClassicAudio();
