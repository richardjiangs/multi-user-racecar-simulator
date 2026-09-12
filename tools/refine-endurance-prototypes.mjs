// Complete the interrupted prototypes. Art sources are hand-authored SVGs in endurance-art/.
// Shared road/input plumbing stays in each self-contained simulator.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const ROOT = resolve(import.meta.dirname, '..');
const staged = [];
function one(s, re, out) {
  const n = [...s.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))].length;
  if (n !== 1) throw new Error(`Expected one anchor (${n}): ${re}`);
  return s.replace(re, () => out);
}
for (const [key, file, globalName] of [['919','Porsche 919 Hybrid simulator.html','Porsche919App'],['499p','Ferrari 499P simulator.html','Ferrari499PApp']]) {
  let s = readFileSync(resolve(ROOT,file),'utf8');
  const porsche = key === '919';
  if (!s.includes('ENDURANCE POWER MODEL v2')) {
    s = one(s, /  function engineTorque\(rpm\) \{[\s\S]*?\n  }/, `  // ENDURANCE POWER MODEL v2: the engine and electric axle have separate power limits.
  function engineTorque(rpm) {
    const omega = rpm * Math.PI * 2 / 60;
    const peak = ${porsche ? '500' : 'SPEC.peakTorqueNm'};
    const plateau = peak * (.62 + .38 * clamp((rpm - SPEC.idleRpm) / (SPEC.torqueLoRpm - SPEC.idleRpm), 0, 1));
    return Math.max(0, Math.min(plateau, ${porsche ? '368000' : 'SPEC.peakPowerW'} / Math.max(omega, 1)));
  }
  // Battery capacity is an explicit simulator assumption. Porsche's 8 MJ is the per-lap
  // deployment allowance at Le Mans, NOT a claim about the physical battery capacity.
  const HYBRID = { capacityMJ: ${porsche ? '4' : '2.5'}, motorKw: ${porsche ? '294' : '200'}, minKmh: ${porsche ? '0' : '190'} };
  function hybridStep(dt, canMove) {
    const v = Math.abs(state.speedMps), soc = clamp(state.hybridEnergy / 100, 0, 1);
    const lapBudget = ${porsche ? 'state.route.active ? 8 * state.route.totalM / 13629 : 8' : 'Infinity'};
    const allowance = Math.max(0, lapBudget - (state.hybridLapUsedMJ || 0));
    const boost = state.boostHeld || state.keys.KeyV || state.energyMode === 1;
    const demand = canMove && state.gearMode === "G" && !state.sail && !state.pitLimiter && !state.fcy && state.brake < .1 && v * 3.6 >= HYBRID.minKmh && state.energyMode !== 2;
    const targetKw = demand ? HYBRID.motorKw * state.throttle * ${porsche ? '(boost || v < 45 ? 1 : .60)' : '(boost ? 1 : .70)'} : 0;
    const deployKw = Math.min(targetKw, soc * HYBRID.capacityMJ * 1000 / dt, allowance * 1000 / dt);
    const harvestKw = state.ignition && v > 3
      ? Math.min(${porsche ? '180' : '200'}, state.brake * ${porsche ? '180' : '200'} * (.72 + state.brakeMigration / 100))
        + ${porsche ? '(state.throttle > .4 ? 80 * state.throttle * clamp(state.rpm / SPEC.redlineRpm, 0, 1) : state.energyMode === 2 ? Math.min(90, v * 2) : 0)' : '0'} : 0;
    state.coastRecupKw = state.energyMode === 2 && state.brake < .1 && state.throttle <= .4 && state.ignition && v > 3 ? ${porsche ? "Math.min(90, v * 2)" : "0"} : 0;
    state.mguPowerKw = deployKw;
    state.regenPowerKw = Math.min(harvestKw, (1 - soc) * HYBRID.capacityMJ * 1000 / dt + deployKw);
    state.hybridEnergy = clamp((soc * HYBRID.capacityMJ + (state.regenPowerKw - deployKw) * dt / 1000) / HYBRID.capacityMJ * 100, 0, 100);
    state.hybridLapUsedMJ = (state.hybridLapUsedMJ || 0) + deployKw * dt / 1000;
    state.hybridLapBudgetMJ = lapBudget;
    return deployKw;
  }
  app.hybridStep = hybridStep;`);
    s = one(s, /    const mguLive =[^\n]*\n[\s\S]*?    const cap = tractionCapN\(\)[^\n]*;/, `    const deployKw = hybridStep(dt, canMove);
    const mguLive = deployKw > 0;
    const engineRaw = torqueAvail * state.throttle * harnessLimiter * shiftCut * ratio * SPEC.finalDrive * SPEC.drivelineEff / SPEC.wheelRadiusM;
    const electricRaw = deployKw * 1000 * SPEC.drivelineEff * harnessLimiter / Math.max(speedAbs, 7);
    const totalPowerLimit = SPEC.peakPowerW * SPEC.drivelineEff / Math.max(speedAbs, 7);
    const rawForce = canMove && !state.sail ? Math.min(engineRaw + electricRaw, totalPowerLimit) : 0;
    state.powerUnitKw = rawForce * speedAbs / SPEC.drivelineEff / 1000;
    // The LMH motor replaces part of rear-axle power under BoP; it never adds 200 kW
    // on top of the combined limit. LMP1 instead adds front boost to its smaller V4.
    const cap = tractionCapN() * (mguLive ? ${porsche ? '1.08' : '1.035'} : 1) * (1 - Math.max(0, (state.tcLevel || 5) - 5) * .015);`);
    s = s.replace('let total = engineForce - drag - roll - brakeForce;', `let total = engineForce - drag - roll - brakeForce;
    // Manual recuperation decelerates the Porsche; harvested kinetic energy is not free.
    ${porsche ? 'if (state.energyMode === 2 && speedAbs > 3 && state.brake < .1) total -= Math.min(state.coastRecupKw, state.regenPowerKw) * 1000 / speedAbs * Math.sign(state.speedMps);' : ''}`);
    s = s.replace('state.route.remainingM = state.route.totalM;   // next lap', 'state.route.remainingM = state.route.totalM; state.hybridLapUsedMJ = 0; // fresh deployment allowance');
    s = s.replace('  function selectCircuit(name) {', '  function selectCircuit(name) { state.hybridLapUsedMJ = 0;');
    s = s.replace('const govMps = SPEC.topSpeedMps;', 'const govMps = state.fcy ? 80 * KMH : SPEC.topSpeedMps;');
    s = s.replace('derived 330 km/h Le Mans-style envelope', 'configured performance envelope');
    s = s.replace('state.hybridEnergy||75', 'state.hybridEnergy??75');
    s = s.replace('state.rpm > 6050', 'state.rpm > SPEC.redlineRpm * .96');
    s = s.replace('the 2024 rear wing is fixed', `the ${porsche ? '2017 LMP1' : 'LMH'} rear wing is fixed`);
    s = s.replace('rotInertia:.76', 'rotInertia:1.03');
    s = s.replace('rotInertia:.94', 'rotInertia:1.03');
    s = s.replace('Object.assign(state, { hybridEnergy:75,', 'Object.assign(state, { shiftTimer:0, manualHold:0, aeroDeploy:0, aeroRearDeploy:0, aeroFrontDeploy:0, aeroDragDeploy:0, downforceN:0, hybridLap:0, hybridLapUsedMJ:0, mguPowerKw:0, regenPowerKw:0, boostHeld:false, fcy:false, sail:false, tcLevel:5, flashUntil:0, wiper:false, hybridEnergy:75,');
    s = s.replace('    hybridEnergy: 75,', '    hybridLap:0, hybridLapUsedMJ:0, mguPowerKw:0, regenPowerKw:0, boostHeld:false, fcy:false, sail:false, tcLevel:5, flashUntil:0, wiper:false,\n    hybridEnergy: 75,');
    s = s.replace('front MGU prioritises deployment above the regulated speed threshold', porsche ? 'front-axle boost draws from the finite store and the 8 MJ lap allowance' : 'front ERS supplies up to 200 kW above 190 km/h within the combined BoP cap');
    s = s.replace('the front MGU remains regulation-gated', porsche ? 'front MGU assists while energy remains' : 'front ERS stays off below 190 km/h');
    s = s.replace('if (pal.night) drawHeadlights(w, h);', 'if (pal.night || (state.flashUntil > state.time && Math.floor(state.time * 5) % 2 === 0)) drawHeadlights(w, h);');
    s = s.replace('The requested 2.', 'The estimated 2.');
    s = s.replace('120-degree 120°', '120-degree');
    s = s.replace('min-width:132px', 'min-width:132px');
    s = s.replaceAll('carbon-ceramic brakes','carbon-carbon brakes');
    // Keep the user's shared UI input architecture, but expose racing controls on the wheel.
    s = s.replace('title="Front axle lift">Lift', 'title="Full Course Yellow speed limiter">FCY 80');
    s = one(s, /  function toggleLift\(\) \{[^\n]*\}/, '  function toggleLift() { state.fcy = !state.fcy; audio.click(900); setActive("liftBtn",state.fcy); showToast(state.fcy ? "Full Course Yellow — 80 km/h limiter." : "Green flag — FCY limiter released."); }');
    s = s.replace('this._set(this.pulseDepth.gain,engLevel*.67,.035);this.combFilter.frequency.setTargetAtTime(210+rpmN*1080+load*260,t,.04);', porsche ? 'this._set(this.pulseDepth.gain,engLevel*.82,.022);this.combFilter.frequency.setTargetAtTime(180+rpmN*1350+load*430,t,.025);' : 'this._set(this.pulseDepth.gain,engLevel*.57,.04);this.combFilter.frequency.setTargetAtTime(320+rpmN*1680+load*180,t,.035);');
    s = s.replace('x>.66?Math.pow((x-.66)/.34,.45):0', porsche ? 'x>.52?Math.pow((x-.52)/.48,.28):0' : 'x>.74?Math.pow((x-.74)/.26,.68):0');
    s = one(s, /      const mguAudible=[^\n]*/, `      const mguAudible = (s.mguPowerKw || 0) + (s.regenPowerKw || 0) > 1;
      this.mguOsc.frequency.setTargetAtTime(${porsche ? '610+Math.abs(s.speedMps)*41' : '520+Math.abs(s.speedMps)*36'},t,.04);this._set(this.mguGain.gain,mguAudible?${porsche ? '.0034' : '.0027'}:0,.06);`);
    s = s.replace('turbo * 0.9', `turbo * ${porsche ? '.20' : '.14'}`);
    s = s.replace('      num("cabSpeedArt", spd);', `      num("cabSpeedArt", spd);
      put("protoSoc", state.displayPage === 2 ? Math.round(state.oilTempC) + "°C" : Math.round(state.hybridEnergy) + "%");
      put("protoMap", ${porsche ? '["AUTO","BOOST","RECUP"]' : '["STINT","ATTACK","CHARGE"]'}[state.energyMode]);
      put("protoMgu", Math.round(state.mguPowerKw || 0) + " kW");
      put("protoRecup", Math.round(state.regenPowerKw || 0) + " kW");
      put("protoBias", state.brakeMigration + "%");
      put("protoLapEnergy", (state.hybridLapUsedMJ || 0).toFixed(2) + " MJ");
      put("protoTc", String(state.tcLevel || 5));
      put("protoMap", state.drinkUntil > state.time ? "DRINK" : state.displayPage === 1 ? Math.round(state.regenPowerKw || 0) + "kW REC" : ${porsche ? '["AUTO","BOOST","RECUP"]' : '["STINT","ATTACK","CHARGE"]'}[state.energyMode]);
      put("protoTemp", Math.round(state.oilTempC) + "°C");
      const wipe = document.getElementById("protoWiper");
      if (wipe) wipe.setAttribute("transform", "rotate(" + (state.wiper ? Math.sin(state.time * 4) * 32 : -35) + " 500 65)");
      document.querySelectorAll('[data-proto="fcy"]').forEach(e=>e.setAttribute('aria-pressed',String(state.fcy)));
      document.querySelectorAll('[data-proto="sail"]').forEach(e=>e.setAttribute('aria-pressed',String(state.sail)));`);
    if (porsche) {
      s = s.replace('["stint", "attack", "charge"][state.energyMode] || "stint"', '["auto", "boost", "recup"][state.energyMode] || "auto"');
      s = s.replace('Porsche\'s 2017 Le Mans special grid: period LMP1 rivals and the two works 919s.', 'A historic LMP1 reunion, including the 2017 works entries and earlier rivals.');
      s = s.replace('dist:13626', 'dist:13629').replaceAll('13.626 km','13.629 km');
    }
    // Discard unreachable donor drawings rather than keeping false model identities in source.
    s = one(s, /  \/\* (Porsche 919 Hybrid|Ferrari 499P) exterior[\s\S]*?  function (porsche|ferrari)Wheel\(/, `  /* BODYKIT:BEGIN ${porsche ? 'Porsche 919 Hybrid' : 'Ferrari 499P'} — DRAWN BY HAND.
     Maintained in tools/endurance-art; proportions and panel lines come from this car. */
  function ${porsche ? 'porsche' : 'ferrari'}Wheel(`);
    const controls = `
/* ===== prototype wheel controls — same actions from SVG, keyboard and quick bar ===== */
{
  const app = window.${globalName}, s = app.state;
  app.prototypeControl = function(action) {
    if (action === 'map') app.toggleHybridAttack();
    else if (action === 'bias' || action === 'recup') app.cycleBrakeMigration();
    else if (action === 'pit') app.togglePit();
    else if (action === 'fcy') app.toggleLift();
    else if (action === 'neutral') app.setGear('N');
    else if (action === 'mi-up' || action === 'mi-down') { s.displayPage = ((s.displayPage || 0) + (action === 'mi-up' ? 1 : 2)) % 3; app.showToast(['Race display', 'Energy display', 'Temperatures display'][s.displayPage]); }
    else if (action === 'bias-up' || action === 'bias-down') { s.brakeMigration = Math.max(48, Math.min(58, s.brakeMigration + (action === 'bias-up' ? 2 : -2))); app.showToast('Brake migration ' + s.brakeMigration + '%'); }
    else if (action === 'tc-front' || action === 'tc-rear') { s.tcLevel = (s.tcLevel || 5) % 10 + 1; app.showToast('Traction control ' + s.tcLevel); }
    else if (action === 'tc') { s.tcLevel = (s.tcLevel || 5) % 10 + 1; app.showToast('Traction control ' + s.tcLevel); }
    else if (action === 'sail') { s.sail = !s.sail; app.showToast(s.sail ? 'SAIL — combustion drive disengaged.' : 'Combustion drive restored.'); }
    else if (action === 'flash') { s.flashUntil = s.time + 1.2; app.showToast('Three headlamp flashes — passing signal.'); }
    else if (action === 'wipe') { s.wiper = !s.wiper; app.showToast(s.wiper ? 'Wiper running.' : 'Wiper parked.'); }
    else if (action === 'drink') { s.drinkUntil = s.time + 2; app.audio.motor(.35); app.showToast('Drinks pump running — driver hydration.'); }
    else if (action === 'start') document.getElementById('startSwitchBtn').click();
    else if (action === 'radio') app.showToast('Pit wall: energy ' + Math.round(s.hybridEnergy) + ' percent, ' + Math.round(s.mguPowerKw || 0) + ' kilowatts deployed.');
    else if (action === 'ok' || action === 'box') app.showToast(action === 'box' ? 'Pit request acknowledged — limiter on entry.' : 'Setting confirmed.');
    else if (action === 'display') { s.dataHud = !s.dataHud; app.showToast(s.dataHud ? 'Telemetry display on.' : 'Telemetry display off.'); }
    else if (action === 'strat') app.cycleMode();
    else if (action === 'light') app.toggleLights();
    else if (action === 'boost') { s.boostHeld = !s.boostHeld; app.showToast(s.boostHeld ? 'Boost requested — limited by available energy.' : 'Boost released.'); }
    app.audio.click(1050);
  };
  document.addEventListener('click', e => { const n=e.target.closest('[data-proto]'); if(n) app.prototypeControl(n.dataset.proto); });
  document.addEventListener('keydown', e => { const n=e.target.closest('[data-proto]'); if(n && (e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopImmediatePropagation();app.prototypeControl(n.dataset.proto);} },true);
}
`;
    s = s.replace('</script>', controls + '\n</script>');
    s = s.replace('</style>', '    [data-proto] { cursor:pointer; outline:none; } [data-proto]:hover, [data-proto]:focus { filter:brightness(1.7); } [data-proto][aria-pressed="true"] { filter:drop-shadow(0 0 5px #ffe52a); }\n</style>');
  }
  // Art is always emitted from the reviewed SVG sources, never from the old donor generator.
  const art = name => readFileSync(resolve(import.meta.dirname,'endurance-art',key+'-'+name+'.svg'),'utf8');
  const exterior = art('exterior'), cockpit = art('cockpit'), engine = art('engine');
  s = one(s, /  function injectExterior\(\)\{[\s\S]*?  function weave\(\)/, `  function injectExterior(){
    app.el.exteriorArt.innerHTML = \`${exterior}\`;
    for(const id of ['doorArt','quadExhaustArt','bcBody','rearWingArt','frontFlapArt']) app.el[id]=document.getElementById(id);
  }
  function injectArt(){
    injectExterior(); app.el.cabinArt.innerHTML = \`${cockpit}\`;
    app.el.engineBay.innerHTML = '<div class="heat-haze"></div>' + \`${engine}\` + '<div class="cover" id="engineCover">${porsche ? 'LMP1' : 'LMH'} BODYWORK CLOSED</div>';
    app.el.engineCover=document.getElementById('engineCover'); app.el.turboL=null; app.el.turboR=null;
  }
  /* BODYKIT:END */
  function weave()`);
  // Initial engine container has no competing donor geometry or duplicate IDs before injection.
  s = one(s, /<div class="engine-bay" id="engineBay">[\s\S]*?<\/div><div class="control-grid">/, '<div class="engine-bay" id="engineBay"><div class="cover" id="engineCover">BODYWORK CLOSED</div></div><div class="control-grid">');
  staged.push([resolve(ROOT,file),s]);
}
for(const [file,s] of staged){writeFileSync(file,s);console.log(file);}
