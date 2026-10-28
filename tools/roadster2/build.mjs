import fs from 'node:fs';
let s=fs.readFileSync('Tesla Model S Plaid simulator.html','utf8');
const replace=(a,b)=>{if(!s.includes(a))throw Error('Missing donor anchor '+a.slice(0,80));s=s.replace(a,b);};
s=s.replaceAll('TeslaApp','RoadsterApp').replaceAll('Tesla Model S Plaid','Tesla Roadster 2').replaceAll('Model S Plaid','Roadster 2').replaceAll('TESLA MODEL S PLAID','TESLA ROADSTER 2').replaceAll('Plaid','Roadster').replaceAll('Ludicrous','Ground / Flight');
s=s.replace(/\/\* ===========================================================================[\s\S]*?\*\//,`/* TESLA ROADSTER 2 — 2026 appearance and three variants referenced to
https://www.tesla.com/roadster?redirect=no (October 2026).
Precise vehicle mass, drivetrain and flight performance are unpublished. SPEC is
an explicitly estimated simulator model, not certified production performance. */`);
s=s.replace(/const SPEC = \{[\s\S]*?\n\};/,`const SPEC = {
 name: "Tesla Roadster 2",engineLabel:"Electric drive + cold-gas augment (simulation model)",displacementCc:0,
 massKg:1800,rotInertia:1.04,peakPowerW:900000,peakPowerPS:1224,peakPowerHp:1207,peakPowerKw:900,peakPowerRpm:6000,
 peakTorqueNm:1600,torqueLoRpm:0,torqueHiRpm:6000,idleRpm:0,redlineRpm:24000,finalDrive:7.5,gearRatios:[1],reverseRatio:1,wheelRadiusM:.35,
 dragCd:.30,dragCdTopSpeed:.30,frontalAreaM2:2,rollingResistance:.012,airDensity:1.225,drivelineEff:.96,tractionCoeff:1.8,
 topSpeedKmh:400,topSpeedMps:400*KMH,topSpeedLimitedKmh:400,topSpeedLimitedMps:400*KMH,topSpeedRecordKmh:400,topSpeedRecordMps:400*KMH,
 zeroTo100Kmh:1.8,quarterMileS:8.5,packSagStartRpm:24000,packSagPerRpm:0,packSagFloor:1,regenMps2:1.5,brakeMaxMps2:12,brakeDist100to0M:30,
 shiftTimeS:0,launchRpm:0,aeroClA:1.4,aeroDragAdd:.18,estimated:true
};`);
s=s.replace(/<p>Tri-motor AWD[^<]+<\/p>/,'<p>Performance · Z Thrust augment · Y Rocket / SpaceX · electric drive · cold-gas thrust.</p>');
s=s.replace(/(<span class="small" id="engineStatus">)[^<]+/,'$1Electric drive and cold-gas installation. Layout schematic; unpublished power, mass and flight limits use simulation estimates.');
s=s.replace(/<p>Settle into the white minimalist cabin\.[\s\S]*?<\/p>/,'<p>A low white cockpit, yoke, dual forward displays and working center touchscreen. Z adds Thrust; Y arms Rocket / SpaceX. P/L hover vertically; W/S pitch to climb or dive, I/O rotate in place, F holds position, G lands. Exact production performance is not published: this car uses a clearly labelled simulation model.</p>');
s=s.replace(/(<h3 id="ls5"[^>]*>)[\s\S]*?<\/p>/,`$1 6. Roadster: ground to flight</h3><p>Start with the Performance car. Z arms the rear Thrust augment; hold V to fire it. Y selects the Rocket / SpaceX arrangement. Close the doors, buckle up and hold P to hover up. L hovers down. W/S pitch the nose up/down, including full loops; Tab/Shift raise/lower a held throttle lever by 5% per press; A/D adjust a held roll-rate yoke, allowing continuous 360° barrel rolls without steering or sideways drift. Arrow up/down are temporary accelerator/brake pedals; arrow left/right, a horizontal touchpad swipe or touch wheel steer heading. I/O turn the nose left/right in place through any angle, independently of A/D roll. F brakes to a fixed hover position and levels the car. G descends for landing.</p><p>In Real Mode cold gas is finite and a hard landing damages suspension and body. Stop on the ground and press REFILL for service. With Real Mode off the tank replenishes and impacts do not create persistent damage.</p><p>Tesla's current Roadster page documents Performance, Thrust and Rocket variants. This simulation models unpublished mass, power, stored gas impulse and flight dynamics; its 400 km/h ceiling is a gameplay benchmark. It does not certify production performance.</p><p>JFK 13R/31L uses its published 4,423 m × 60.96 m runway envelope. Golden Gate uses the bridge district's principal dimensions. Surrounding buildings and terrain are authored approximations; the bridge ramp and Tesla grounds are simulator environments. The McGregor ramp is a demonstration-inspired arena.</p>`);
s=s.replaceAll('Tri-motor','Electric').replaceAll('tri-motor','electric-drive').replaceAll('three motors','drive units').replaceAll('1,020 horsepower','electric power').replaceAll('carbon-sleeved rotors · single-speed drive · torque vectoring · yoke steering · 100 kWh pack','single-speed drive · yoke steering · active aero');
replace('function projectAhead(distAhead, lateralM) {','function projectAhead(distAhead, lateralM) { if(app.roadsterScene?.())return app.roadsterProjection(distAhead,lateralM);');
replace('function drawRearView(mx, my, mw, mh, p, pal) {','function drawRearView(mx, my, mw, mh, p, pal) { if(app.roadsterScene?.())return app.drawRoadsterRear(mx,my,mw,mh);');
replace('function drawSky(w, h, pal) {','function drawSky(w, h, pal) { if(app.roadsterSky)return app.roadsterSky(w,h);');
replace('function drawCabinFrame(w, h, pal) {','function drawCabinFrame(w, h, pal) { if(app.roadsterDrawCabin)return app.roadsterDrawCabin(w,h);');
replace('function drawWorld() {','function drawWorld() { if(app.roadsterScene?.()){app.drawRoadsterWorld();return;}');
replace('const STEERING = { wheelbase: 2.960, frontTrack: 1.664, maxAngle: 0.58 };','const STEERING = { wheelbase: 2.75, frontTrack: 1.68, maxAngle: 35*Math.PI/180 };');
replace('function steerFactorOf(speedAbs) { return clamp(1.15 - speedAbs * 0.013, 0.44, 1); }','function steerFactorOf(speedAbs) { return app.roadsterSteerAngle(1,speedAbs)/STEERING.maxAngle; }');
replace('function updateInputs(dt) {','function updateInputs(dt) { if(app.roadsterReadInputs?.(dt))return;');
// Standalone Roadster also uses the immediate fullscreen chord.
s=s.replace(/      chordArmed = true;\n      enterFullscreen\(\);[\s\S]*?      }, 3000\);/, '      setTrackpad(true, true);');
// Body injection precedes event binding so reset/feature listeners use the Roadster methods.
replace('/* ===== events ===== */', ['art.js','aircraft.js','world.js','runtime.js'].map(f=>fs.readFileSync('tools/roadster2/'+f,'utf8')).join('\n')+'\ninstallRoadsterRuntime(window.RoadsterApp);\n/* ===== events ===== */');
replace('app.setMode("race");\n  requestAnimationFrame(gameLoop);','app.setMode("race"); app.selectCircuit("Tesla Development Grounds");\n  requestAnimationFrame(gameLoop);');
const sceneNames=['Tesla Development Grounds','JFK Airport — Runway 13R/31L','Golden Gate Bridge — Stunt Ramp','SpaceX McGregor — Demo Ramp'];
replace('<button data-circuit="Circuit de Monaco"',sceneNames.map(n=>`<button data-circuit="${n}">${n}</button>`).join('\n')+'\n<button data-circuit="Circuit de Monaco"');
// Feature descriptions must describe this car rather than the donor sedan.
s=s.replace(/title="Track Package:[^"]+"/,'title="Z toggles the Thrust augment; hold V to fire rear cold-gas thrusters"');
s=s.replaceAll('Track Pack','Thrust augment').replaceAll('track pack','thrust augment').replaceAll('Track Package','Thrust augment').replaceAll('200 mph','400 km/h model benchmark').replaceAll('322 km/h','400 km/h model benchmark').replaceAll('262 km/h','400 km/h model benchmark');
s=s.replaceAll('0.208','0.30').replaceAll('Bioweapon Defense Mode — the HEPA filter floods the cabin with clean air.','Cabin cooling on.').replaceAll('HEPA back to normal.','Cabin cooling off.');
s=s.replaceAll('Exterior — Five-Seat Ground / Flight Sedan','Exterior — 2026 Roadster side elevation').replaceAll('Pearl White Multi-Coat, flush handles, glass roof, carbon spoiler','Ano White · gold glazing · titanium · flush active aero').replaceAll('Yoke, 17&quot; landscape screen, white minimalist cabin, glass roof','Yoke · twin forward displays · live center touchscreen · white fixed seats').replaceAll('Arachnid 21&quot; · PS4S','Thin-spoke wheels · modeled tyres').replaceAll('265 / 295','Roadster').replaceAll('auto-present doors','hinged doors').replaceAll('air suspension','ride height').replaceAll('Roadster: full 1,020 hp, dampers firm, stability trail.','Roadster: full simulation power, firm dampers.').replaceAll('plaid mode','performance mode').replaceAll('plaid','performance');
// A distinct synthesized electric voice: smooth motor orders, air-system hiss separately gated by force.
s=s.replace('mul: 2.0,  gain: 0.22','mul: 2.4,  gain: 0.18').replace('mul: 4.0,  gain: 0.16','mul: 3.8,  gain: 0.14').replace('mul: 6.0,  gain: 0.10','mul: 5.0,  gain: 0.12').replace('mul: 6.02, gain: 0.08','mul: 5.03, gain: 0.09').replace('mul: 9.0,  gain: 0.04','mul: 8.0,  gain: 0.035');
s=s.replace('const road = clamp(spd / 60, 0, 1) * 0.13','const road = (s.roadster?.airborne?0:1)*clamp(spd / 60, 0, 1) * 0.13');
s=s.replace('const turbo = clamp(s.boostBar, 0, 1.4) * (0.06 + rpmN * 0.30);','const turbo = 0;');
s=s.replace('TRACK PACK · 400 km/h model benchmark (400 km/h model benchmark) unlocked','THRUST AUGMENT · V fires the rear jets').replaceAll('Bioweapon Defense','Cabin Cooling').replaceAll('Spine Light','Console Light');
// Remove unused donor drawings altogether; the visible Roadster geometry is authored in art.js.
{const a=s.indexOf('  function drawCabinFrame('),b=s.indexOf('  function drawHeadlights(',a);s=s.slice(0,a)+'  function drawCabinFrame(w,h,pal){app.roadsterDrawCabin?.(w,h); }\n'+s.slice(b);}
{const a=s.indexOf('  /* Tesla exterior'),b=s.indexOf('  Object.assign(app, { resizeCanvas',a);s=s.slice(0,a)+'  function injectArt() { /* Installed by the Roadster artwork module before first render. */ }\n'+s.slice(b);}
s=s.replaceAll('>Recline +<','>Yoke nearer<').replaceAll('>Recline -<','>Yoke farther<').replaceAll('seat recline','yoke reach');
s=s.replace(/\/\* ===== data: vehicle spec[\s\S]*?\*\//,'/* Roadster: explicitly estimated simulation parameters; see learning panel and tools/roadster2/README.md. */');
s=s.replaceAll('Drive Units — Tri-Motor + 100 kWh Pack','Electric Drive + Cold Gas').replaceAll('100 kWh STRUCTURAL PACK · 3 × CARBON-SLEEVED MOTORS','BATTERY TRAY · DRIVE UNITS · SCHEMATIC');
const {execFileSync}=await import('node:child_process');execFileSync(process.execPath,['--check','--input-type=module'],{input:s.split('<script type="module">')[1].split('</script>')[0]});
fs.writeFileSync('Tesla Roadster 2 simulator.html',s);console.log('Roadster source generated:',Buffer.byteLength(s),'bytes');
