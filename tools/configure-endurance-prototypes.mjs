import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

function replaceOne(source, find, replacement, label) {
  const count = typeof find === "string"
    ? source.split(find).length - 1
    : [...source.matchAll(new RegExp(find.source, find.flags.includes("g") ? find.flags : find.flags + "g"))].length;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return source.replace(find, replacement);
}

function ensureCircuitData(html, config) {
  if (html.includes("const CIRCUITS =")) return html;
  const donor = readFileSync(resolve(ROOT, "Peugeot 9X8 simulator.html"), "utf8");
  const match = donor.match(/\/\* ===== data: circuits[\s\S]*?const TRACK_WIDTH_SCALE = 3\.75;[^\n]*/);
  if (!match) throw new Error(`${config.short}: could not recover shared circuit data`);
  const circuits = match[0].replace(/  "MotorLand Aragón": \{[^\n]+\},/, config.circuit);
  return html.replace(/\/\* ===== data: (Porsche 919|Ferrari 499P)/, `${circuits}\n\n$&`);
}

function configure(config) {
  const path = resolve(ROOT, config.file);
  let html = readFileSync(path, "utf8");
  if (html.includes(`const SPEC={name:"${config.name}"`)) {
    html = ensureCircuitData(html, config);
    writeFileSync(path, html);
    console.log(`already configured ${config.file}`);
    return;
  }

  const basic = [
    ["--teal: #16b3a6;          /* " + (config.sourceAccent || config.baseName.replace(/^Porsche /, "")) + " accent */", `--teal: ${config.accent};          /* ${config.short} accent */`],
    ["--teal-b: #8fe6dd;", `--teal-b: ${config.accentBright};`],
    ["--amber: #ffd23c;         /* giallo tachometer */", `--amber: ${config.warning};         /* shift-light colour */`],
    ["--amber-b: #ffe9a0;", `--amber-b: ${config.warningBright};`],
    [`<div class="mark">${config.markSource}</div>`, `<div class="mark">${config.mark}</div>`],
    [`<h1>${config.baseName}</h1>`, `<h1>${config.name}</h1>`],
    [config.headerSource, config.header],
    [config.exteriorHeadingSource, config.exteriorHeading],
    [config.paintSource, config.paint],
    [config.cockpitSource, config.cockpit],
    [config.powerUnitSource, config.powerUnit],
    [config.engineStatusSource, config.engineStatus],
    [config.dynamicsSource, config.dynamics],
    [config.dynStatusSource, config.dynStatus],
    [config.learnSource, config.learn],
  ];
  for (const [from, to] of basic) {
    if (!html.includes(from)) throw new Error(`${config.short}: missing basic token ${from.slice(0, 80)}`);
    html = html.replace(from, to);
  }

  html = replaceOne(html, /  "MotorLand Aragón": \{[^\n]+\},/, config.circuit, `${config.short} circuit`);
  html = html.replaceAll("MotorLand Aragón", config.circuitName);
  html = html.replaceAll("motorland", config.voiceKeywords[0]);
  html = html.replaceAll("aragon", config.voiceKeywords[1]);
  html = html.replaceAll("aragón", config.voiceKeywords[1]);
  html = html.replaceAll("alcaniz", config.voiceKeywords[2]);
  html = html.replaceAll("alcañiz", config.voiceKeywords[2]);

  html = replaceOne(
    html,
    /\/\* ===== data: Peugeot 9X8[\s\S]*?const SPEC=\{[^\n]+\};/,
    config.specBlock,
    `${config.short} spec`,
  );

  html = replaceOne(
    html,
    /      \/\/ Little [^:]+ V6:[\s\S]*?      ];\n      this\.oscs = defs\.map/,
    `${config.audioComment}\n      const defs = ${JSON.stringify(config.oscillators, null, 8).replace(/"(type|mul|gain|toShaper)":/g, "$1:")};\n      this.oscs = defs.map`,
    `${config.short} oscillator bank`,
  );
  html = html.replace("const shaper = c.createWaveShaper(); shaper.curve = this._satCurve(3.8);", `const shaper = c.createWaveShaper(); shaper.curve = this._satCurve(${config.saturation});`);
  html = html.replace("this.combFilter.frequency.value=270;this.combFilter.Q.value=.72;", `this.combFilter.frequency.value=${config.combFrequency};this.combFilter.Q.value=${config.combQ};`);
  html = html.replace("this.gearOsc=c.createOscillator();this.gearOsc.type=\"square\";", `this.gearOsc=c.createOscillator();this.gearOsc.type="${config.gearWave}";`);
  html = html.replace("gearFilter.frequency.value=4300;gearFilter.Q.value=10;", `gearFilter.frequency.value=${config.gearFilter};gearFilter.Q.value=${config.gearQ};`);
  html = html.replace("this.turboNode = mkNoise(\"bandpass\", 7600, 14);", `this.turboNode = mkNoise("bandpass", ${config.turboFilter}, ${config.turboQ});`);
  html = replaceOne(html, /      const firing = Math\.max\(18,\(s\.rpm\/60\)\*3\) \/\/ 90-degree V6: three combustion events per revolution;/, `      const firing = Math.max(18,(s.rpm/60)*${config.firingPulses}); // ${config.firingComment}`, `${config.short} firing order`);
  html = html.replace("const cutoff=300+s.rpm*.3+load*2900+(s.exhaustValve?850:0);", config.cutoff);
  html = replaceOne(html, /      const turboFreq=6400\+rpmN\*3200\+s\.boostBar\*1450;[^\n]*/, `      ${config.turboFrequency}`, `${config.short} turbo frequency`);
  html = replaceOne(html, /      this\.gearOsc\.frequency\.setTargetAtTime\([^\n]+/, `      ${config.gearAudio}`, `${config.short} gear audio`);
  html = replaceOne(html, /      const mguAudible=[^\n]+/, `      ${config.mguAudio}`, `${config.short} MGU audio`);

  html = replaceOne(html, /  \/\* MotorLand hosts[\s\S]*?  ];\n  function lapLen/, `${config.grid}\n  function lapLen`, `${config.short} special grid`);
  html = html.replace("? PEUGEOT_SPORT_GRID : GRID_CARS", `? ${config.gridName} : GRID_CARS`);

  html = html.replace("const mguLive = speedAbs > 52.8 && state.hybridEnergy > 2 && state.energyMode !== 2;", config.mguPhysics);
  html = html.replace("state.hybridEnergy + state.brake * dt * 3.2 * (0.72 + state.brakeMigration / 100)", config.regenFormula);
  html = html.replace("state.hybridEnergy - state.throttle * dt * (state.energyMode === 1 ? 2.0 : .75)", config.deployFormula);
  html = html.replace("const cap = tractionCapN() * (mguLive ? (state.energyMode === 1 ? 1.055 : 1.025) : 1);", config.tractionCap);
  html = html.replace("// BoP caps combined output at 520 kW: deployment redistributes torque to the front axle\n    // instead of adding power. The benefit appears as improved traction above 190 km/h.", config.hybridPhysicsComment);

  html = html.replaceAll("const PEUGEOT_SPORT_GRID", `const ${config.gridName}`);
  html = html.replaceAll("peugeotWheel", config.wheelFunction);
  html = html.replaceAll("PEUGEOT SPORT", config.engineBrand);
  html = html.replaceAll("PEUGEOT i-COCKPIT", config.cockpitBrand);
  html = html.replaceAll("2.6 V6 HYBRID", config.engineShort);
  html = html.replaceAll("520 kW BoP", config.powerShort);
  html = html.replaceAll("LMP1 V6", config.audioEngineName);
  html = html.replaceAll("V6 oil", config.oilLabel);
  html = html.replaceAll("twin-turbo boost", config.boostLabel);
  html = html.replaceAll("twin-turbo V6", config.enginePhrase);
  html = html.replaceAll("90-degree LMP1 V6", config.blipPhrase);
  html = html.replaceAll("V6 lit", config.litPhrase);
  html = html.replaceAll("V6 catches", config.catchPhrase);
  html = html.replaceAll("rear V6 drive", config.drivePhrase);
  html = html.replaceAll("rear V6 staged", config.launchPhrase);
  html = html.replaceAll("V6, seven-speed", config.coverPhrase);
  html = html.replaceAll("V6 hybrid power unit", config.physicsHeading);
  html = html.replaceAll("2.6-litre", config.litrePhrase);
  html = html.replaceAll("2.6 L V6", config.engineBayPhrase);
  html = html.replaceAll("200 kW FRONT MGU · 900 V · BRAKE-BY-WIRE", config.eMotorLabel);
  html = html.replaceAll("Hybrid STINT", config.hybridButton);
  html = html.replaceAll("Brake Mig 52%", config.brakeButton);
  html = html.replaceAll("Brake Mig ${state.brakeMigration}%", config.brakeButtonTemplate);
  html = html.replaceAll("brake-by-wire migration", config.brakeControlPhrase);
  html = html.replaceAll("Brake-by-wire migration", config.brakeControlPhraseCapital);

  html = replaceOne(html, /  function drawCabinFrame\(w,h,pal\)\{[\s\S]*?\n  }\n    function drawHeadlights/, config.dynamicCockpit + "\n    function drawHeadlights", `${config.short} dynamic cockpit`);
  html = replaceOne(html, /  function [a-zA-Z0-9]+Wheel\(cx,r\)\{[\s\S]*?\n\s+function weave\(\)/, config.art + "\n  function weave()", `${config.short} art`);

  for (const bad of ["PEUGEOT", "Peugeot", "9X8", "MotorLand Aragón"]) {
    if (html.includes(bad)) throw new Error(`${config.short}: donor token remains: ${bad}`);
  }
  html = ensureCircuitData(html, config);
  writeFileSync(path, html);
  console.log(`configured ${config.file}`);
}

const commonPorscheGrid = `  /* Porsche's 2017 Le Mans special grid: period LMP1 rivals and the two works 919s. */
  const PORSCHE_LMP1_GRID = [
    { name:"Porsche 919 Hybrid #2", body:"#f4f5f2", stripe:"#c8172c", top: 334.9, latG:2.15, accel:13.8 },
    { name:"Porsche 919 Hybrid #1", body:"#f4f5f2", stripe:"#111820", top:366, latG:2.14, accel:13.7 },
    { name:"Toyota TS050 Hybrid #8", body:"#f4f5f2", stripe:"#e10620", top:352, latG:2.12, accel:13.6 },
    { name:"Toyota TS050 Hybrid #7", body:"#f4f5f2", stripe:"#181b20", top:352, latG:2.12, accel:13.6 },
    { name:"Audi R18 e-tron quattro", body:"#d6dade", stripe:"#df1d2f", top:340, latG:2.08, accel:13.0 },
    { name:"Porsche 919 Hybrid (2016)", body:"#f6f6f2", stripe:"#15181c", top:350, latG:2.08, accel:13.2 },
    { name:"Toyota TS040 Hybrid", body:"#e9edf0", stripe:"#e4212e", top:340, latG:2.00, accel:12.7 },
    { name:"Audi R18 TDI Ultra", body:"#cfd4d8", stripe:"#1a1e24", top:340, latG:1.98, accel:12.4 }
  ];`;

const commonFerrariGrid = `  /* Ferrari's Imola special grid: the 499P works cars against current Hypercar rivals. */
  const FERRARI_HYPERCAR_GRID = [
    { name:"Ferrari 499P #51", body:"#d7192d", stripe:"#f5d328", top:347, latG:2.08, accel:13.1 },
    { name:"Ferrari 499P #50", body:"#d7192d", stripe:"#f5d328", top:347, latG:2.08, accel:13.1 },
    { name:"Ferrari 499P #83", body:"#f0d823", stripe:"#d7192d", top:345, latG:2.07, accel:13.0 },
    { name:"Toyota GR010 Hybrid", body:"#f4f5f2", stripe:"#e10620", top:340, latG:2.08, accel:12.9 },
    { name:"Porsche 963", body:"#f4f5f2", stripe:"#d91f32", top:340, latG:2.06, accel:12.9 },
    { name:"Cadillac V-Series.R", body:"#d4b23a", stripe:"#111820", top:338, latG:2.03, accel:12.7 },
    { name:"BMW M Hybrid V8", body:"#f4f5f2", stripe:"#1474c4", top:338, latG:2.03, accel:12.7 },
    { name:"Alpine A424", body:"#176fd1", stripe:"#ed5b9b", top:338, latG:2.04, accel:12.7 }
  ];`;

const porscheDynamicCockpit = `  function drawCabinFrame(w,h,pal){
    const y=h*.64,s=state.bodyRoll;ctx.fillStyle="#020305";ctx.fillRect(0,y-12,w,h-y+12);
    ctx.strokeStyle="#cbd0d4";ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(w*.02,h);ctx.lineTo(w*.14,y-94+s);ctx.lineTo(w*.39,y-50+s);ctx.moveTo(w*.98,h);ctx.lineTo(w*.87,y-94+s);ctx.lineTo(w*.61,y-50+s);ctx.stroke();
    ctx.strokeStyle="#d21f36";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(w*.04,h);ctx.lineTo(w*.14,y-94+s);ctx.lineTo(w*.5,y-64+s);ctx.lineTo(w*.87,y-94+s);ctx.lineTo(w*.96,h);ctx.stroke();
    ctx.fillStyle="#0a0d10";ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(w*.2,y+4);ctx.lineTo(w*.34,h);ctx.fill();ctx.beginPath();ctx.moveTo(w,h);ctx.lineTo(w*.8,y+4);ctx.lineTo(w*.66,h);ctx.fill();drawCluster(w,h,y,s);drawWheel(w,h);
  }
  function drawCluster(w,h,y,s){
    const R=Math.min(w,h)*.068,cx=w*.5+s,cy=y-R*.82,km=Math.abs(app.kmh(state.speedMps));ctx.save();ctx.translate(cx,cy);ctx.fillStyle="#010203";ctx.strokeStyle="#d21f36";ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-R*2.65,-R*.72,R*5.3,R*1.45,3);ctx.fill();ctx.stroke();
    const rpmN=clamp(state.rpm/SPEC.redlineRpm,0,1);for(let i=0;i<15;i++){ctx.fillStyle=i/14<rpmN?(i>11?"#ef2437":i>8?"#ffe329":"#38b9ef"):"#20252a";ctx.fillRect(-R*2.43+i*R*.33,-R*.56,R*.26,R*.1);}ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 "+(R*.54)+"px monospace";ctx.fillText(state.gearMode==="G"?state.curGear:state.gearMode,0,R*.2);ctx.font="800 "+(R*.24)+"px monospace";ctx.fillText(Math.round(km)+" KM/H",-R*1.55,R*.18);ctx.fillStyle="#ffe329";ctx.fillText(Math.round(state.hybridEnergy||75)+"%",R*1.55,R*.08);ctx.font="700 "+(R*.1)+"px monospace";ctx.fillText(["8MJ AUTO","BOOST","RECUP"][state.energyMode]||"8MJ AUTO",R*1.55,R*.38);ctx.restore();
  }
  function drawWheel(w,h){
    const R=Math.min(w,h)*.295;ctx.save();ctx.translate(w*.5,h*1.18);ctx.rotate(state.steer*.82);ctx.fillStyle="#07090c";ctx.strokeStyle="#e8ecef";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-R*.96,-R*.43);ctx.lineTo(-R*.78,R*.43);ctx.lineTo(-R*.4,R*.6);ctx.lineTo(R*.4,R*.6);ctx.lineTo(R*.78,R*.43);ctx.lineTo(R*.96,-R*.43);ctx.lineTo(R*.62,-R*.61);ctx.lineTo(-R*.62,-R*.61);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle="#d21f36";ctx.strokeRect(-R*.4,-R*.31,R*.8,R*.49);const colours=["#38b9ef","#ffe329","#d21f36","#51cc77"];for(let i=0;i<12;i++){const side=i%2?-1:1,x=side*R*(.55+(i%3)*.12),yy=R*(-.4+Math.floor(i/3)*.2);ctx.fillStyle=colours[i%4];ctx.beginPath();ctx.arc(x,yy,R*.045,0,Math.PI*2);ctx.fill();}ctx.restore();
  }`;

const ferrariDynamicCockpit = `  function drawCabinFrame(w,h,pal){
    const y=h*.64,s=state.bodyRoll;ctx.fillStyle="#030304";ctx.fillRect(0,y-12,w,h-y+12);ctx.fillStyle="#151518";ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(w*.18,y-4+s);ctx.lineTo(w*.38,h);ctx.fill();ctx.beginPath();ctx.moveTo(w,h);ctx.lineTo(w*.82,y-4+s);ctx.lineTo(w*.62,h);ctx.fill();ctx.strokeStyle="#d7192d";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(w*.03,h);ctx.lineTo(w*.16,y-99+s);ctx.lineTo(w*.42,y-55+s);ctx.moveTo(w*.97,h);ctx.lineTo(w*.84,y-99+s);ctx.lineTo(w*.58,y-55+s);ctx.stroke();ctx.strokeStyle="#f5d328";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w*.16,y-99+s);ctx.lineTo(w*.5,y-67+s);ctx.lineTo(w*.84,y-99+s);ctx.stroke();drawCluster(w,h,y,s);drawWheel(w,h);
  }
  function drawCluster(w,h,y,s){
    const R=Math.min(w,h)*.071,cx=w*.5+s,cy=y-R*.82,km=Math.abs(app.kmh(state.speedMps));ctx.save();ctx.translate(cx,cy);ctx.fillStyle="#050506";ctx.strokeStyle="#d7192d";ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(-R*2.9,-R*.73,R*5.8,R*1.47,8);ctx.fill();ctx.stroke();const rpmN=clamp(state.rpm/SPEC.redlineRpm,0,1);for(let i=0;i<16;i++){ctx.fillStyle=i/15<rpmN?(i>12?"#ff2738":i>9?"#f5d328":"#42cfff"):"#232326";ctx.fillRect(-R*2.65+i*R*.33,-R*.56,R*.26,R*.1);}ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="900 "+(R*.57)+"px sans-serif";ctx.fillText(state.gearMode==="G"?state.curGear:state.gearMode,0,R*.21);ctx.font="800 "+(R*.23)+"px monospace";ctx.fillText(Math.round(km)+" KM/H",-R*1.73,R*.17);ctx.fillStyle="#f5d328";ctx.fillText(Math.round(state.hybridEnergy||75)+"% ERS",R*1.72,R*.06);ctx.font="700 "+(R*.1)+"px monospace";ctx.fillText(["STINT","ATTACK","CHARGE"][state.energyMode]||"STINT",R*1.72,R*.36);ctx.restore();
  }
  function drawWheel(w,h){
    const R=Math.min(w,h)*.3;ctx.save();ctx.translate(w*.5,h*1.18);ctx.rotate(state.steer*.82);ctx.fillStyle="#0a0a0c";ctx.strokeStyle="#d7192d";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-R*.94,-R*.42);ctx.lineTo(-R*.78,R*.47);ctx.lineTo(-R*.34,R*.64);ctx.lineTo(R*.34,R*.64);ctx.lineTo(R*.78,R*.47);ctx.lineTo(R*.94,-R*.42);ctx.lineTo(R*.58,-R*.6);ctx.lineTo(-R*.58,-R*.6);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#020203";ctx.strokeStyle="#f5d328";ctx.beginPath();ctx.roundRect(-R*.39,-R*.32,R*.78,R*.5,5);ctx.fill();ctx.stroke();for(const p of [[-.68,-.3,"#28b9e6"],[.68,-.3,"#28b9e6"],[-.73,.04,"#d7192d"],[.73,.04,"#d7192d"],[-.57,.38,"#f5d328"],[.57,.38,"#f5d328"],[-.3,.43,"#56c86c"],[.3,.43,"#56c86c"]]){ctx.fillStyle=p[2];ctx.beginPath();ctx.arc(R*p[0],R*p[1],R*.055,0,Math.PI*2);ctx.fill();}ctx.restore();
  }`;

function wheelFunction(name, accent, spokes) {
  return `  function ${name}(cx,r){let s="";for(let i=0;i<${spokes};i++){const a=i*Math.PI*2/${spokes};s+=\`<path d="M\${cx+Math.cos(a)*r*.24} \${287+Math.sin(a)*r*.24}L\${cx+Math.cos(a)*r*.76} \${287+Math.sin(a)*r*.76}"/>\`;}return \`<g><circle cx="\${cx}" cy="287" r="\${r}" fill="#040507" stroke="#25292e" stroke-width="9"/><circle cx="\${cx}" cy="287" r="\${r*.73}" fill="#12161a" stroke="${accent}" stroke-width="2"/><g stroke="#667079" stroke-width="7">\${s}</g><circle cx="\${cx}" cy="287" r="\${r*.19}" fill="${accent}"/></g>\`;}`;
}

const porscheArt = `${wheelFunction("porscheWheel", "#d21f36", 8)}
  function injectExterior(){
    app.el.exteriorArt.innerHTML=\`<svg viewBox="0 0 1000 400" role="img" aria-label="Porsche 919 Hybrid number 2 2017 LMP1 side elevation">
      <defs><linearGradient id="p919paint" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#d9dde0"/><stop offset="1" stop-color="#6f757b"/></linearGradient><linearGradient id="p919glass" x2="0" y2="1"><stop stop-color="#718b9a"/><stop offset="1" stop-color="#020407"/></linearGradient></defs><rect width="1000" height="400" fill="#101317"/><path d="M0 333H1000V400H0Z" fill="#1a1e23"/><ellipse cx="505" cy="348" rx="440" ry="16" fill="#000" opacity=".72"/>
      <g id="rearWingArt"><path d="M126 193V96M285 176V88" stroke="#11151a" stroke-width="11"/><path d="M73 73Q200 53 337 61L333 88Q198 80 76 102Z" fill="#080b0f" stroke="#d21f36" stroke-width="3"/></g>
      <g id="bcBody"><path d="M68 299Q54 274 67 246Q91 202 149 190L322 179Q378 125 454 107Q540 86 623 144L697 187L835 195Q920 207 954 254L941 307L830 315 A79 91 0 0 0 672 315L355 313 A82 92 0 0 0 191 313Z" fill="url(#p919paint)" stroke="#fff" stroke-width="3"/><path d="M355 313 A82 92 0 0 1 191 313M830 315 A79 91 0 0 1 672 315" fill="none" stroke="#5f656a" stroke-width="5"/>
      <path d="M330 178Q390 121 459 107Q535 89 606 145L673 187L559 181L523 112L453 121L394 179Z" fill="url(#p919glass)" stroke="#8999a2"/><path d="M493 101L509 50L540 54L551 121Z" fill="#11151a" stroke="#737a80"/><path d="M65 248Q165 202 322 184L257 226L72 284Z" fill="#d21f36"/><path d="M330 192Q267 185 217 233L254 284L363 221Z" fill="#030507"/>
      <g id="doorArt"><path d="M397 180L617 151L682 267L520 294L480 202Z" fill="rgba(255,255,255,.05)" stroke="#8f969b"/><path d="M508 288L550 184L635 168L662 260Z" fill="#090c0f"/><path d="M411 181L488 277" stroke="#d21f36" stroke-width="4"/></g><path d="M696 187L835 195Q911 206 949 244L848 263L738 228Z" fill="#cdd1d4"/><path d="M806 205L943 235L866 262L746 231Z" fill="#101419"/><g stroke="#fff" stroke-width="6"><path d="M882 219l49 14"/><path d="M870 231l49 14"/><path d="M857 243l49 14"/></g><path d="M80 294Q510 322 942 285" fill="none" stroke="#05070a" stroke-width="16"/><path d="M321 183Q500 211 696 188" fill="none" stroke="#d21f36" stroke-width="5"/><text x="574" y="252" text-anchor="middle" fill="#11151a" font-size="35" font-weight="900">2</text><text x="621" y="251" fill="#d21f36" font-size="14" font-weight="800">919 HYBRID</text><g fill="#161b20"><path d="M229 187l18-28 20 24-4 31-30 5z"/><path d="M280 184l17-27 19 23-4 30-29 6z"/><path d="M706 191l19-29 20 27-4 29-30 6z"/><path d="M755 194l18-28 20 27-5 29-29 5z"/></g></g>
      <g id="frontFlapArt"><path d="M813 298L970 276L950 318L780 327Z" fill="#05080b"/></g><g id="quadExhaustArt"><ellipse cx="111" cy="267" rx="18" ry="11" fill="#b2bac0"/><ellipse cx="111" cy="267" rx="10" ry="6" fill="#14191e"/></g>\${porscheWheel(274,67)}\${porscheWheel(754,69)}</svg>\`;
    app.el.doorArt=document.getElementById("doorArt");app.el.quadExhaustArt=document.getElementById("quadExhaustArt");app.el.bcBody=document.getElementById("bcBody");app.el.rearWingArt=document.getElementById("rearWingArt");app.el.frontFlapArt=document.getElementById("frontFlapArt");
  }
  function injectArt(){injectExterior();app.el.cabinArt.innerHTML=\`<svg viewBox="0 0 1000 360" role="img" aria-label="Porsche 919 Hybrid 2017 carbon safety cell and multifunction steering wheel"><defs><linearGradient id="p919cab" x2="1" y2="1"><stop stop-color="#252a30"/><stop offset="1" stop-color="#030406"/></linearGradient><pattern id="p919weave" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 10L10 0M-2 2L2-2M8 12l4-4" stroke="#242b31" stroke-width="2"/></pattern></defs><rect width="1000" height="360" fill="url(#p919cab)"/><path d="M55 360L130 65L260 205M945 360L870 65L740 205" stroke="#727980" stroke-width="18"/><path d="M58 360L132 68L500 119L868 68L942 360" fill="none" stroke="#d21f36" stroke-width="4"/><path d="M0 360V218L216 169L315 360ZM1000 360V218L784 169L685 360Z" fill="url(#p919weave)" stroke="#42494f"/><g transform="translate(500 94)"><rect x="-155" y="-40" width="310" height="91" rx="4" fill="#010203" stroke="#d21f36" stroke-width="3"/><g>\${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>\`<rect x="\${-139+i*23}" y="-24" width="17" height="8" fill="\${i>9?'#ef2437':i>6?'#ffe329':'#38b9ef'}"/>\`).join("")}</g><text x="-101" y="22" text-anchor="middle" fill="#fff" font-size="27" id="cabSpeedArt">0</text><text x="0" y="25" text-anchor="middle" fill="#fff" font-size="42" font-weight="900" id="tachGearArt">N</text><text x="103" y="11" text-anchor="middle" fill="#ffe329" font-size="13">SOC 75%</text><text x="103" y="31" text-anchor="middle" fill="#e8ecef" font-size="10">8MJ AUTO · RECUP 52</text></g><g id="cabinWheelG" transform="translate(500 286)"><path d="M-118-50L-94 55L-48 75H48L94 55L118-50L74-77H-74Z" fill="#06090c" stroke="#d9dde0" stroke-width="4"/><rect x="-52" y="-40" width="104" height="69" rx="3" fill="#010203" stroke="#d21f36"/><text x="0" y="-15" text-anchor="middle" fill="#9da7ad" font-size="8">PORSCHE 919</text><text x="0" y="13" text-anchor="middle" fill="#ffe329" font-size="18">8 MJ</text>\${Array.from({length:24},(_,i)=>{const side=i%2?-1:1;const col=["#38b9ef","#ffe329","#d21f36","#52c77b"][i%4];const x=side*(66+(i%3)*16),y=-38+Math.floor(i/6)*25;return \`<circle cx="\${x}" cy="\${y}" r="5.5" fill="\${col}"/>\`;}).join("")}<path d="M-129-42v93M129-42v93M-141-31v70M141-31v70" stroke="#aab2b8" stroke-width="6"/></g><text x="500" y="349" text-anchor="middle" fill="#b4bbc0" font-size="10" letter-spacing="3">2017 LMP1 · 24 CONTROLS · SIX PADDLES · BOOST / RECUP</text></svg>\`;
    app.el.engineBay.innerHTML=\`<div class="heat-haze"></div><div class="turbo left" id="turboL"></div><svg viewBox="0 0 1000 360" style="position:absolute;inset:2%;width:96%;height:88%" role="img" aria-label="Porsche 919 2.0 litre turbo V4 hybrid power unit"><defs><linearGradient id="p919metal" x2="0" y2="1"><stop stop-color="#d8dde1"/><stop offset="1" stop-color="#41484e"/></linearGradient></defs><rect x="24" y="18" width="952" height="316" rx="34" fill="#090d11" stroke="#515a62" stroke-width="5"/><path d="M62 48L352 125M938 48L648 125M80 311L353 211M920 311L647 211" stroke="url(#p919metal)" stroke-width="13"/><path d="M500 36V321" stroke="#d21f36" stroke-width="5"/><g fill="#cfd4d7" stroke="#f5f7f8" stroke-width="4"><path d="M244 102L468 80L472 257L205 276L170 211Z"/><path d="M756 102L532 80L528 257L795 276L830 211Z"/></g><g fill="#333a40" stroke="#11161a" stroke-width="4"><circle cx="292" cy="141" r="34"/><circle cx="407" cy="150" r="34"/><circle cx="708" cy="141" r="34"/><circle cx="593" cy="150" r="34"/></g><path d="M426 73h148l50 123-124 85-124-85z" fill="#101419" stroke="#687178" stroke-width="4"/><text x="500" y="139" text-anchor="middle" fill="#fff" font-size="22" font-weight="900">PORSCHE 919</text><text x="500" y="171" text-anchor="middle" fill="#d21f36" font-size="18">2.0 TURBO V4</text><text x="500" y="201" text-anchor="middle" fill="#ffe329" font-size="13">8 MJ HYBRID · &gt;662 kW</text><g fill="#aeb7bd" stroke="#263039" stroke-width="5"><circle cx="118" cy="97" r="49"/></g><g fill="none" stroke="#d21f36" stroke-width="7"><circle cx="118" cy="97" r="28"/></g><path d="M167 99Q244 84 299 112" fill="none" stroke="#343d44" stroke-width="19"/><rect x="350" y="279" width="300" height="46" rx="12" fill="#242b31" stroke="#ffe329" stroke-width="3"/><text x="500" y="307" text-anchor="middle" fill="#edf1f3" font-size="13">FRONT MGU · EXHAUST RECOVERY · 8 MJ</text></svg><div class="emotor" id="eAxleArt">&gt;294 kW FRONT MGU · 8 MJ CLASS · AWD BOOST</div><div class="bay-exhaust"><i></i><i></i><i></i><i></i></div><div class="cover" id="engineCover">LMP1 BODYWORK CLOSED</div>\`;app.el.engineCover=document.getElementById("engineCover");app.el.turboL=document.getElementById("turboL");app.el.turboR=document.getElementById("turboR");
  }`;

const ferrariArt = `${wheelFunction("ferrariWheel", "#f5d328", 6)}
  function injectExterior(){app.el.exteriorArt.innerHTML=\`<svg viewBox="0 0 1000 400" role="img" aria-label="Ferrari 499P number 51 Le Mans Hypercar side elevation"><defs><linearGradient id="f499red" x2="0" y2="1"><stop stop-color="#f02838"/><stop offset=".5" stop-color="#c80f24"/><stop offset="1" stop-color="#5d0711"/></linearGradient><linearGradient id="f499glass" x2="0" y2="1"><stop stop-color="#6f8490"/><stop offset="1" stop-color="#020305"/></linearGradient></defs><rect width="1000" height="400" fill="#131417"/><path d="M0 333H1000V400H0Z" fill="#202126"/><ellipse cx="507" cy="348" rx="441" ry="16" fill="#000" opacity=".74"/><g id="rearWingArt"><path d="M128 194V114M288 177V105" stroke="#101216" stroke-width="11"/><path d="M70 88Q199 69 345 74L340 100Q197 94 73 116Z" fill="#111419" stroke="#f5d328" stroke-width="3"/><path d="M82 105Q204 90 334 94" stroke="#d7192d" stroke-width="5"/></g><g id="bcBody"><path d="M63 299Q51 273 64 246Q87 205 151 190L326 179Q391 122 472 106Q557 90 631 147L699 188L840 195Q921 207 958 252L942 307L834 315 A79 91 0 0 0 676 315L355 313 A82 92 0 0 0 191 313Z" fill="url(#f499red)" stroke="#ff6571" stroke-width="3"/><path d="M355 313 A82 92 0 0 1 191 313M834 315 A79 91 0 0 1 676 315" fill="none" stroke="#35050b" stroke-width="5"/><path d="M335 178Q397 120 477 106Q551 93 615 147L676 187L563 180L529 112L463 121L399 179Z" fill="url(#f499glass)" stroke="#8898a0"/><path d="M500 103L509 54L542 57L555 121Z" fill="#111419"/><path d="M66 249Q171 204 323 185L255 226L71 285Z" fill="#f5d328"/><path d="M333 192Q271 185 216 233L253 284L368 221Z" fill="#050608"/><g id="doorArt"><path d="M400 179L623 151L685 268L520 294L480 202Z" fill="rgba(255,255,255,.04)" stroke="#f47d86"/><path d="M510 288L551 184L640 168L665 261Z" fill="#140307"/></g><path d="M699 188L840 195Q915 205 951 242L854 264L741 228Z" fill="#b60d20"/><path d="M802 203L948 236L870 264L744 231Z" fill="#080a0d"/><path d="M819 198l17-28 19 27-5 28-29 5zM774 194l17-27 19 26-4 27-29 6zM729 191l17-27 19 26-4 27-29 6z" fill="#101317"/><g stroke="#f5d328" stroke-width="5"><path d="M880 218l53 15"/><path d="M868 231l53 15"/></g><path d="M80 294Q509 322 943 285" fill="none" stroke="#050608" stroke-width="16"/><path d="M321 184Q504 210 702 188" fill="none" stroke="#f5d328" stroke-width="6"/><text x="568" y="254" text-anchor="middle" fill="#fff" font-size="35" font-weight="900">51</text><text x="628" y="253" fill="#f5d328" font-size="16" font-weight="900">499P</text><g fill="#11151a"><path d="M228 188l17-28 20 24-4 31-31 5z"/><path d="M278 184l17-27 20 24-4 30-30 6z"/></g></g><g id="frontFlapArt"><path d="M815 298L972 276L951 319L781 327Z" fill="#06080b"/><path d="M848 288L968 270" stroke="#f5d328" stroke-width="5"/></g><g id="quadExhaustArt"><ellipse cx="112" cy="267" rx="18" ry="11" fill="#aeb6bc"/><ellipse cx="112" cy="267" rx="10" ry="6" fill="#14181c"/></g>\${ferrariWheel(274,67)}\${ferrariWheel(758,69)}</svg>\`;app.el.doorArt=document.getElementById("doorArt");app.el.quadExhaustArt=document.getElementById("quadExhaustArt");app.el.bcBody=document.getElementById("bcBody");app.el.rearWingArt=document.getElementById("rearWingArt");app.el.frontFlapArt=document.getElementById("frontFlapArt");}
  function injectArt(){injectExterior();app.el.cabinArt.innerHTML=\`<svg viewBox="0 0 1000 360" role="img" aria-label="Ferrari 499P safety cell, wide race display and LMH steering controls"><defs><linearGradient id="f499cab" x2="1" y2="1"><stop stop-color="#2b292b"/><stop offset="1" stop-color="#030304"/></linearGradient><pattern id="f499weave" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9L9 0M-2 2L2-2M7 11l4-4" stroke="#242326" stroke-width="2"/></pattern></defs><rect width="1000" height="360" fill="url(#f499cab)"/><path d="M48 360L126 64L258 202M952 360L874 64L742 202" stroke="#55565a" stroke-width="20"/><path d="M51 360L129 67L500 120L871 67L949 360" fill="none" stroke="#d7192d" stroke-width="6"/><path d="M0 360V218L218 169L320 360ZM1000 360V218L782 169L680 360Z" fill="url(#f499weave)" stroke="#454549"/><g transform="translate(500 95)"><rect x="-162" y="-42" width="324" height="94" rx="7" fill="#030304" stroke="#f5d328" stroke-width="3"/><g>\${[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i=>\`<rect x="\${-145+i*21}" y="-26" width="16" height="8" fill="\${i>11?'#ff2738':i>8?'#f5d328':'#42cfff'}"/>\`).join("")}</g><text x="-106" y="22" text-anchor="middle" fill="#fff" font-size="28" id="cabSpeedArt">0</text><text x="0" y="26" text-anchor="middle" fill="#fff" font-size="44" font-weight="900" id="tachGearArt">N</text><text x="107" y="9" text-anchor="middle" fill="#f5d328" font-size="13">ERS 75%</text><text x="107" y="31" text-anchor="middle" fill="#fff" font-size="10">STINT · BBW 52</text></g><g id="cabinWheelG" transform="translate(500 286)"><path d="M-115-51L-92 54L-47 75H47L92 54L115-51L70-76H-70Z" fill="#08080a" stroke="#d7192d" stroke-width="5"/><rect x="-52" y="-40" width="104" height="69" rx="5" fill="#020203" stroke="#f5d328"/><text x="0" y="-15" text-anchor="middle" fill="#a7a7aa" font-size="8">FERRARI 499P</text><text x="0" y="13" text-anchor="middle" fill="#f5d328" font-size="18">LMH</text><g fill="#42cfff"><circle cx="-84" cy="-27" r="8"/><circle cx="84" cy="-27" r="8"/></g><g fill="#d7192d"><circle cx="-91" cy="11" r="9"/><circle cx="91" cy="11" r="9"/></g><g fill="#f5d328"><circle cx="-70" cy="46" r="8"/><circle cx="70" cy="46" r="8"/></g><g fill="#55c878"><circle cx="-42" cy="51" r="7"/><circle cx="42" cy="51" r="7"/></g></g><g transform="translate(746 193)"><path d="M0 0l151 24-12 132-159-29z" fill="#08080a" stroke="#77777b"/><text x="66" y="23" text-anchor="middle" fill="#f5d328" font-size="10">ERS / BBW / TC</text><g fill="#d7192d"><circle cx="30" cy="57" r="13"/><circle cx="77" cy="65" r="13"/><circle cx="119" cy="72" r="13"/></g><path d="M24 100h104M24 121h104" stroke="#42cfff" stroke-width="8"/></g><text x="500" y="349" text-anchor="middle" fill="#b8b8bb" font-size="10" letter-spacing="3">499P · 900 V ERS · BRAKE-BY-WIRE · SEVEN-SPEED</text></svg>\`;
    app.el.engineBay.innerHTML=\`<div class="heat-haze"></div><div class="turbo left" id="turboL"></div><div class="turbo right" id="turboR"></div><svg viewBox="0 0 1000 360" style="position:absolute;inset:2%;width:96%;height:88%" role="img" aria-label="Ferrari 499P load-bearing 120 degree V6 hybrid power unit"><defs><linearGradient id="f499metal" x2="0" y2="1"><stop stop-color="#dedede"/><stop offset="1" stop-color="#4b4b4f"/></linearGradient></defs><rect x="24" y="18" width="952" height="316" rx="34" fill="#0a0a0c" stroke="#55555a" stroke-width="5"/><path d="M65 45L350 126M935 45L650 126M83 310L349 209M917 310L651 209" stroke="url(#f499metal)" stroke-width="13"/><path d="M500 36V321" stroke="#d7192d" stroke-width="6"/><g fill="#cfd0d1" stroke="#f4f4f4" stroke-width="4"><path d="M180 106L448 78L468 255L150 279L120 208Z"/><path d="M820 106L552 78L532 255L850 279L880 208Z"/></g><g fill="#3b3b40" stroke="#131317" stroke-width="4"><circle cx="239" cy="135" r="29"/><circle cx="332" cy="145" r="29"/><circle cx="421" cy="154" r="29"/><circle cx="761" cy="135" r="29"/><circle cx="668" cy="145" r="29"/><circle cx="579" cy="154" r="29"/></g><path d="M424 72h152l48 121-124 90-124-90z" fill="#111116" stroke="#74747a" stroke-width="4"/><text x="500" y="140" text-anchor="middle" fill="#fff" font-size="23" font-weight="900">FERRARI 499P</text><text x="500" y="173" text-anchor="middle" fill="#d7192d" font-size="18">3.0 120° V6</text><text x="500" y="203" text-anchor="middle" fill="#f5d328" font-size="13">500 kW / 680 cv</text><g fill="#adb0b4" stroke="#292a2e" stroke-width="5"><circle cx="112" cy="95" r="43"/><circle cx="888" cy="95" r="43"/></g><g fill="none" stroke="#d7192d" stroke-width="7"><circle cx="112" cy="95" r="25"/><circle cx="888" cy="95" r="25"/></g><path d="M154 98Q226 81 282 111M846 98Q774 81 718 111" fill="none" stroke="#33343a" stroke-width="18"/><rect x="352" y="279" width="296" height="46" rx="12" fill="#26262b" stroke="#f5d328" stroke-width="3"/><text x="500" y="307" text-anchor="middle" fill="#f0f0f1" font-size="13">900 V · 200 kW FRONT ERS · 7-SPEED</text></svg><div class="emotor" id="eAxleArt">200 kW FRONT ERS · 900 V · ACTIVE ABOVE 190 KM/H</div><div class="bay-exhaust"><i></i><i></i><i></i><i></i></div><div class="cover" id="engineCover">LMH BODYWORK CLOSED</div>\`;app.el.engineCover=document.getElementById("engineCover");app.el.turboL=document.getElementById("turboL");app.el.turboR=document.getElementById("turboR");
  }`;

configure({
  file:"Porsche 919 Hybrid simulator.html", baseName:"Porsche 919 Hybrid", name:"Porsche 919 Hybrid #2 (2017)", short:"919", markSource:"919 Hybrid", mark:"919", accent:"#d21f36", accentBright:"#ff7989", warning:"#ffe329", warningBright:"#fff3a1",
  headerSource:"2.6 L 90° twin-turbo V6 · 200 kW front-axle MGU · 900 V battery · 7-speed sequential · carbon LMP1 monocoque · fixed 2024 rear wing.", header:"2.0 L 90° turbo V4 · front MGU and exhaust recovery · 8 MJ hybrid class · 7-speed sequential · 875 kg carbon LMP1 monocoque.",
  exteriorHeadingSource:"Exterior — 2017 LMP1 Aero", exteriorHeading:"Exterior — 2017 Le Mans low-drag LMP1", paintSource:"White, red and acid-yellow Porsche Sport livery · three-claw lamps · fixed rear wing", paint:"Number 2 Le Mans livery · white, black and red · four-point lamps · dorsal fin and fixed rear wing", cockpitSource:"Single-seat LMP1 safety cell · wheel-mounted display · brake migration and hybrid controls", cockpit:"Single-seat LMP1 safety cell · rectangular 24-control wheel · six paddles · 8 MJ boost and recuperation controls",
  powerUnitSource:"Power Unit — 2.6 L V6 + 200 kW Front MGU", powerUnit:"Power Unit — 2.0 L Turbo V4 + Front MGU", engineStatusSource:"90° twin-turbo V6 · 480–520 kW under BoP · 900 V battery · 7-speed sequential", engineStatus:"90° turbo V4 · under 500 PS combustion · over 400 PS front MGU · exhaust energy recovery · 8 MJ class",
  dynamicsSource:"Dynamics — 7-Speed Sequential · Hybrid AWD · Fixed Wing", dynamics:"Dynamics — 7-Speed Sequential · 8 MJ Temporary AWD · Fixed Le Mans Aero", dynStatusSource:"Race mode: rear V6 drive, regulated front-MGU deployment, brake-by-wire regeneration", dynStatus:"Race mode: rear V4 drive, driver-triggered front boost, exhaust recovery and brake regeneration",
  learnSource:"Settle into the carbon LMP1 safety cell. The rear 2.6-litre twin-turbo V6 catches, the front MGU arms, and the wheel display shows the hybrid energy store. Manage a stint yourself or hand the 919 Hybrid to the test driver at MotorLand Aragón.", learn:"Settle into the 2017 number 2 carbon LMP1 cell. The compact turbo V4 fires behind you, the 8 MJ system arms, and the rectangular wheel offers boost and manual recovery. Manage energy through the Le Mans lap or hand the 919 to the test driver.",
  circuitName:"Circuit de la Sarthe — 2017", circuit:`  "Circuit de la Sarthe — 2017": {dist:13629,env:"track",limitKmh:334.9,loop:true,widthM:16,corners:18,blurb:"the full-width 13.629 km 2017 Le Mans circuit where the number 2 Porsche won",bumps:[{from:5400,to:7600,r:.08}],track:[c(500,1,95,120,"Dunlop"),c(860,-1,115,160,"Forest Esses"),c(1500,1,80,150,"Tertre Rouge"),c(4200,-1,42,90,"Mulsanne Chicane 1"),c(6700,1,45,95,"Mulsanne Chicane 2"),c(9050,1,72,130,"Mulsanne"),c(9800,-1,53,95,"Indianapolis"),c(10120,1,35,65,"Arnage"),c(11250,1,105,165,"Porsche Curves 1"),c(11510,-1,95,150,"Porsche Curves 2"),c(11800,1,82,135,"Corvette"),c(13120,-1,32,70,"Ford Chicane 1"),c(13320,1,34,72,"Ford Chicane 2")]},`, voiceKeywords:["le mans","sarthe","mulsanne"],
  specBlock:`/* ===== data: Porsche 919 Hybrid #2 (2017 LMP1) =====
   Porsche's 2017 technical data: 2.0 L 90-degree turbo V4, under 500 PS combustion,
   over 400 PS front MGU, 8 MJ class, seven-speed sequential and 875 kg minimum mass.
   The requested 2.2 s is a simulator target; 334.9 km/h is the officially measured
   maximum of the winning number 2 car in the 2017 Le Mans race.
   Source: Porsche 919 Hybrid 2017 press kit, Porsche Newsroom. */
const KMH=1/3.6; const MPH=.44704;
const SPEC={name:"Porsche 919 Hybrid #2 (2017)",engineLabel:"2.0 L 90° turbo V4 + >294 kW front MGU",displacementCc:2000,massKg:875,rotInertia:.76,peakPowerW:662000,peakPowerPS:900,peakPowerHp:888,peakPowerKw:662,peakPowerRpm:8500,peakTorqueNm:825,torqueLoRpm:4000,torqueHiRpm:7600,idleRpm:1100,redlineRpm:9000,finalDrive:3.32,gearRatios:[2.76,2.05,1.61,1.31,1.10,.94,.81],reverseRatio:2.8,wheelRadiusM:.348,dragCd:.43,dragCdTopSpeed:.43,frontalAreaM2:1.9,rollingResistance:.010,airDensity:1.225,drivelineEff:.92,tractionCoeff:.941772124,topSpeedKmh:334.9,topSpeedMps:334.9*KMH,topSpeedLimitedKmh:334.9,topSpeedLimitedMps:334.9*KMH,topSpeedRecordKmh:334.9,topSpeedRecordMps:334.9*KMH,zeroTo100Kmh:2.2,derivedZeroTo100:true,brakeMaxMps2:11.3937,brakeDist100to0M:24.5,shiftTimeS:.035,launchRpm:5000,aeroClA:5.15,aeroDragAdd:.39};`,
  audioComment:"      // Porsche 919: uneven compact turbo-V4 pulse, hard wastegate edge and prominent straight-cut transaxle.", oscillators:[{type:"square",mul:.5,gain:.16,toShaper:true},{type:"sawtooth",mul:1,gain:.31,toShaper:true},{type:"triangle",mul:1.5,gain:.11,toShaper:true},{type:"square",mul:2.25,gain:.056,toShaper:false},{type:"sawtooth",mul:4.5,gain:.023,toShaper:false}], saturation:4.65, combFrequency:235, combQ:.92, gearWave:"sawtooth", gearFilter:5100, gearQ:13, turboFilter:8350, turboQ:17, firingPulses:2, firingComment:"90° V4: two combustion events per crank revolution, deliberately rougher than the V6s", cutoff:"const cutoff=260+s.rpm*.34+load*3150+(s.exhaustValve?980:0);", turboFrequency:"const turboFreq=7100+rpmN*4100+s.boostBar*1750; // single turbo and exhaust-recovery turbine shaft", gearAudio:"this.gearOsc.frequency.setTargetAtTime(920+rpmN*5200+Math.max(1,s.curGear)*142,t,.03);this._set(this.gearGain.gain,Math.abs(s.speedMps)>3?.006+load*.014:0,.05);", mguAudio:"const mguAudible=Math.abs(s.speedMps)>4&&s.hybridEnergy>2&&load>.38&&s.energyMode!==2;this.mguOsc.frequency.setTargetAtTime(610+Math.abs(s.speedMps)*41,t,.04);this._set(this.mguGain.gain,mguAudible?.0034:0,.06);",
  grid:commonPorscheGrid, gridName:"PORSCHE_LMP1_GRID", mguPhysics:"const mguLive = speedAbs > 4 && state.hybridEnergy > 2 && state.energyMode !== 2;", regenFormula:"state.hybridEnergy + state.brake * dt * 3.8 * (0.72 + state.brakeMigration / 100)", deployFormula:"state.hybridEnergy - state.throttle * dt * (state.energyMode === 1 ? 2.35 : .9)", tractionCap:"const cap = tractionCapN() * (mguLive ? (state.energyMode === 1 ? 1.11 : 1.055) : 1);", hybridPhysicsComment:"// Porsche's 8 MJ system sends recovered energy to the front axle for temporary AWD.\n    // BOOST prioritises deployment; RECUP withholds it and increases recovery.", wheelFunction:"porscheWheel", engineBrand:"PORSCHE 919", cockpitBrand:"PORSCHE 919", engineShort:"2.0 TURBO V4", powerShort:">662 kW SYSTEM", audioEngineName:"turbo V4", oilLabel:"V4 oil", boostLabel:"single-turbo boost", enginePhrase:"turbo V4", blipPhrase:"compact turbo V4", litPhrase:"V4 lit", catchPhrase:"V4 catches", drivePhrase:"rear V4 drive", launchPhrase:"rear V4 staged", physicsHeading:"turbo V4 hybrid power unit", litrePhrase:"2.0-litre", engineBayPhrase:"2.0 L V4", eMotorLabel:">294 kW FRONT MGU · 8 MJ · EXHAUST RECOVERY", hybridButton:"8 MJ AUTO", brakeButton:"Recup 52%", brakeButtonTemplate:'Recup ${state.brakeMigration}%', brakeControlPhrase:"recuperation bias", brakeControlPhraseCapital:"Recuperation bias", dynamicCockpit:porscheDynamicCockpit, art:porscheArt,
});

configure({
  file:"Ferrari 499P simulator.html", baseName:"Ferrari 499P", sourceAccent:"499P", name:"Ferrari 499P #51", short:"499P", markSource:"499P", mark:"499P", accent:"#d7192d", accentBright:"#ff6571", warning:"#f5d328", warningBright:"#fff19a",
  headerSource:"2.6 L 90° twin-turbo V6 · 200 kW front-axle MGU · 900 V battery · 7-speed sequential · carbon LMH monocoque · fixed 2024 rear wing.", header:"3.0 L 120° twin-turbo V6 · 200 kW front ERS · 900 V battery · 7-speed sequential · carbon LMH monocoque · number 51 Le Mans livery.",
  exteriorHeadingSource:"Exterior — 2024 LMH Aero", exteriorHeading:"Exterior — Ferrari 499P LMH", paintSource:"White, red and acid-yellow Ferrari Sport livery · three-claw lamps · fixed rear wing", paint:"Number 51 Rosso Corsa and Modena yellow · wheel-arch louvers · dorsal fin · twin-plane fixed rear wing", cockpitSource:"Single-seat LMH safety cell · wheel-mounted display · brake migration and hybrid controls", cockpit:"Single-seat LMH safety cell · wide central display · ERS, brake-by-wire and traction rotaries",
  powerUnitSource:"Power Unit — 2.6 L V6 + 200 kW Front MGU", powerUnit:"Power Unit — 3.0 L 120° V6 + 200 kW Front ERS", engineStatusSource:"90° twin-turbo V6 · 480–520 kW under BoP · 900 V battery · 7-speed sequential", engineStatus:"load-bearing 120° twin-turbo V6 · 500 kW combined · 200 kW front ERS · 900 V battery · 7-speed sequential",
  dynamicsSource:"Dynamics — 7-Speed Sequential · Hybrid AWD · Fixed Wing", dynamics:"Dynamics — 7-Speed Sequential · 900 V ERS · Fixed LMH Aero", dynStatusSource:"Race mode: rear V6 drive, regulated front-MGU deployment, brake-by-wire regeneration", dynStatus:"Race mode: load-bearing rear V6, front ERS above 190 km/h, brake-by-wire regeneration",
  learnSource:"Settle into the carbon LMH safety cell. The rear 2.6-litre twin-turbo V6 catches, the front MGU arms, and the wheel display shows the hybrid energy store. Manage a stint yourself or hand the 499P to the test driver at MotorLand Aragón.", learn:"Settle into the number 51 LMH safety cell. The load-bearing 120-degree V6 fires, the 900 V system arms, and the wheel shows ERS and brake-by-wire status. Manage the deployment threshold yourself or hand the 499P to the test driver at Imola.",
  circuitName:"Autodromo Imola — 499P", circuit:`  "Autodromo Imola — 499P": {dist:4909,env:"track",limitKmh:347,loop:true,widthM:16,corners:19,blurb:"the full-width 4.909 km Imola endurance circuit for the 499P",bumps:[{from:3050,to:3450,r:.12}],track:[c(250,1,38,85,"Tamburello 1"),c(340,-1,42,72,"Tamburello 2"),c(450,1,50,90,"Tamburello 3"),c(780,-1,48,85,"Villeneuve"),c(930,1,42,75,"Tosa"),c(1420,1,62,110,"Piratella"),c(1830,-1,46,80,"Acque Minerali 1"),c(1940,1,44,78,"Acque Minerali 2"),c(2390,1,55,90,"Variante Alta 1"),c(2490,-1,50,85,"Variante Alta 2"),c(3130,-1,78,125,"Rivazza 1"),c(3280,-1,92,145,"Rivazza 2"),c(4100,1,45,80,"Gresini 1"),c(4200,-1,48,82,"Gresini 2") ]},`, voiceKeywords:["imola","santerno","tamburello"],
  specBlock:`/* ===== data: Ferrari 499P #51 (LMH) =====
   Ferrari/FIA WEC data: load-bearing 2,992 cc 120-degree twin-turbo V6, 200 kW
   front ERS, 900 V battery, seven-speed sequential and 500 kW / 680 cv combined.
   The requested 2.3 s and 347 km/h are simulator targets; Ferrari publishes no
   road-style 0-100 time for the competition 499P.
   Sources: Ferrari 499P technical story and FIA WEC 499P profile. */
const KMH=1/3.6; const MPH=.44704;
const SPEC={name:"Ferrari 499P #51",engineLabel:"3.0 L 120° twin-turbo V6 + 200 kW front ERS",displacementCc:2992,massKg:1030,rotInertia:.94,peakPowerW:500000,peakPowerPS:680,peakPowerHp:671,peakPowerKw:500,peakPowerRpm:8500,peakTorqueNm:860,torqueLoRpm:3500,torqueHiRpm:7300,idleRpm:1100,redlineRpm:9000,finalDrive:3.45,gearRatios:[2.70,2.02,1.59,1.30,1.09,.93,.80],reverseRatio:2.8,wheelRadiusM:.35,dragCd:.41,dragCdTopSpeed:.41,frontalAreaM2:1.9,rollingResistance:.011,airDensity:1.225,drivelineEff:.92,tractionCoeff:1.163769643,topSpeedKmh:347,topSpeedMps:347*KMH,topSpeedLimitedKmh:347,topSpeedLimitedMps:347*KMH,topSpeedRecordKmh:347,topSpeedRecordMps:347*KMH,zeroTo100Kmh:2.3,derivedZeroTo100:true,brakeMaxMps2:13.9549,brakeDist100to0M:25.0,shiftTimeS:.04,launchRpm:4800,aeroClA:4.85,aeroDragAdd:.42};`,
  audioComment:"      // Ferrari 499P: smoother 120-degree V6 cadence, paired turbo hiss and dense LMH transaxle whine.", oscillators:[{type:"sawtooth",mul:.5,gain:.085,toShaper:true},{type:"triangle",mul:1,gain:.25,toShaper:true},{type:"sawtooth",mul:1.5,gain:.14,toShaper:true},{type:"square",mul:2.5,gain:.054,toShaper:false},{type:"triangle",mul:5,gain:.027,toShaper:false}], saturation:3.25, combFrequency:315, combQ:.62, gearWave:"square", gearFilter:4650, gearQ:11, turboFilter:7900, turboQ:12, firingPulses:3, firingComment:"120° V6: three evenly spaced combustion events per crank revolution", cutoff:"const cutoff=330+s.rpm*.31+load*2820+(s.exhaustValve?820:0);", turboFrequency:"const turboFreq=6300+rpmN*3450+s.boostBar*1380; // paired compact turbochargers", gearAudio:"this.gearOsc.frequency.setTargetAtTime(760+rpmN*4550+Math.max(1,s.curGear)*121,t,.035);this._set(this.gearGain.gain,Math.abs(s.speedMps)>4?.0045+load*.011:0,.06);", mguAudio:"const mguAudible=Math.abs(s.speedMps)>52.8&&s.hybridEnergy>2&&load>.42&&s.energyMode!==2;this.mguOsc.frequency.setTargetAtTime(520+Math.abs(s.speedMps)*36,t,.05);this._set(this.mguGain.gain,mguAudible?.0027:0,.07);",
  grid:commonFerrariGrid, gridName:"FERRARI_HYPERCAR_GRID", mguPhysics:"const mguLive = speedAbs > 52.8 && state.hybridEnergy > 2 && state.energyMode !== 2;", regenFormula:"state.hybridEnergy + state.brake * dt * 3.35 * (0.72 + state.brakeMigration / 100)", deployFormula:"state.hybridEnergy - state.throttle * dt * (state.energyMode === 1 ? 2.05 : .78)", tractionCap:"const cap = tractionCapN() * (mguLive ? (state.energyMode === 1 ? 1.06 : 1.03) : 1);", hybridPhysicsComment:"// LMH rules cap combined output at 500 kW; the front ERS becomes available above 190 km/h.\n    // Deployment redistributes capped power across both axles rather than creating extra power.", wheelFunction:"ferrariWheel", engineBrand:"FERRARI 499P", cockpitBrand:"FERRARI 499P", engineShort:"3.0 120° V6", powerShort:"500 kW / 680 cv", audioEngineName:"120-degree V6", oilLabel:"V6 oil", boostLabel:"twin-turbo boost", enginePhrase:"120° twin-turbo V6", blipPhrase:"load-bearing 120-degree V6", litPhrase:"V6 lit", catchPhrase:"V6 catches", drivePhrase:"rear V6 drive", launchPhrase:"rear V6 staged", physicsHeading:"120-degree V6 hybrid power unit", litrePhrase:"3.0-litre", engineBayPhrase:"3.0 L V6", eMotorLabel:"200 kW FRONT ERS · 900 V · ACTIVE ABOVE 190 KM/H", hybridButton:"Hybrid STINT", brakeButton:"BBW 52%", brakeButtonTemplate:'BBW ${state.brakeMigration}%', brakeControlPhrase:"brake-by-wire migration", brakeControlPhraseCapital:"Brake-by-wire migration", dynamicCockpit:ferrariDynamicCockpit, art:ferrariArt,
});
