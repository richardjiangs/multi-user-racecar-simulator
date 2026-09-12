import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
function one(source, find, replacement, label) {
  const count = typeof find === "string" ? source.split(find).length - 1 : [...source.matchAll(new RegExp(find.source, find.flags.includes("g") ? find.flags : find.flags + "g"))].length;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return source.replace(find, replacement);
}

{
  const file = resolve(ROOT, "Aston Martin Valkyrie simulator.html");
  let s = readFileSync(file, "utf8");
  if (!s.includes('const SPEC = {\n  name: "Aston Martin Valkyrie AMR Pro"')) {
    const pairs = [
      ["<title>Aston Martin Valkyrie — naturally-aspirated V12 hybrid</title>", "<title>Aston Martin Valkyrie AMR Pro — 11,000 rpm V12 track car</title>"],
      ['<canvas id="worldCanvas" aria-label="Aston Martin Valkyrie driving view"></canvas>', '<canvas id="worldCanvas" aria-label="Aston Martin Valkyrie AMR Pro driving view"></canvas>'],
      ["<h1>Aston Martin Valkyrie</h1>", "<h1>Aston Martin Valkyrie AMR Pro</h1>"],
      ["6.5L naturally-aspirated Cosworth V12 + KERS · 7-speed Ricardo single-clutch · rear-wheel drive · pushrod suspension · ground-effect aero.", "AMR Pro 6.5 L naturally-aspirated Cosworth V12 · 7-speed racing transmission · rear-wheel drive · carbon pushrod suspension · extreme ground-effect aero."],
      ['<button id="hybridBtn" class="race active" title="KERS hybrid deploy — the electric motor adds ~160 hp to the V12 for the full 1,160 PS combined">KERS Deploy</button>', '<button id="hybridBtn" class="race active" title="Switch between the AMR Pro Le Mans low-drag trim and its maximum-downforce track trim">Le Mans Trim</button>'],
      ["Engine Bay — 6.5L NA V12 + KERS", "Engine Bay — AMR Pro 6.5 L NA V12"],
      ["6.5L naturally-aspirated Cosworth V12 · 1,000 hp @ 10,500 (1,160 PS combined with KERS) · 900 Nm · 11,100 rpm · 7-speed Ricardo · 0–100 in 2.5 s · 350 km/h · 1,030 kg", "AMR Pro Cosworth 6.5 L naturally-aspirated V12 · 1,000 bhp / 1,014 PS · 11,000 rpm · track-only 7-speed · 0–100 in 2.3 s · 402 km/h simulator target"],
      ["KERS · MGU-K + 1.8 kWh BATTERY", "AMR PRO · DRY-SUMP V12 · RACE TRANSAXLE"],
      ['<div class="readout"><b id="boostRead">0%</b><span>KERS deploy</span></div>', '<div class="readout"><b id="boostRead">LM</b><span>aero trim</span></div>'],
      ["Use a real V8 recording", "Use a real AMR Pro V12 recording"],
      ["1,030 kg and F1-grade underbody aero: the Valkyrie is the road car that behaves like the F1 cars here — fast corners get EASIER with speed. The 10,500 rpm V12 wants revs; short-shifting wastes it.", "The AMR Pro deletes the road car's hybrid hardware and is built around its 11,000 rpm Cosworth V12 and enormous floor. Fast corners gain grip with speed; switch out of Le Mans trim when maximum downforce matters more than straight-line efficiency."],
      ['placeholder="“take me to Nardò”, “race mode”, “launch”, “KERS deploy”"', 'placeholder="“take me to Nardò”, “race mode”, “launch”, “Le Mans trim”"'],
      ["the KERS spools, and the rear wing loads up", "the dry-sump V12 catches, and the AMR Pro aero loads up"],
      ["V12 lit, KERS armed. Pull the right paddle for 1st, or open Circuit for a hot lap.", "AMR Pro V12 lit. Pull the right paddle for 1st, or open Circuit for a hot lap."],
    ];
    for (const [a, b] of pairs) {
      if (!s.includes(a)) throw new Error(`Valkyrie missing: ${a.slice(0, 90)}`);
      s = s.replace(a, b);
    }
    s = one(s, /\/\* ===== data: vehicle spec — EXACT Aston Martin Valkyrie figures =====[\s\S]*?\n};/, `/* ===== Aston Martin Valkyrie AMR Pro =====
   Aston Martin specifies the track-only AMR Pro's modified Cosworth 6.5 L naturally
   aspirated V12 at 1,000 bhp, revving to 11,000 rpm. Unlike the road Valkyrie, AMR Pro
   does not use the battery-electric hybrid system. 1,014 PS is the metric equivalent;
   2.3 s and 402 km/h are the requested simulator performance targets. */
const KMH = 1 / 3.6;
const MPH = 0.44704;
const SPEC = {
  name: "Aston Martin Valkyrie AMR Pro",
  engineLabel: "AMR Pro Cosworth 6.5 L naturally-aspirated V12",
  displacementCc: 6498,
  massKg: 1000,
  rotInertia: .94,
  peakPowerW: 746000,
  peakPowerPS: 1014,
  peakPowerHp: 1000,
  peakPowerKw: 746,
  peakPowerRpm: 10500,
  peakTorqueNm: 740,
  torqueLoRpm: 6000,
  torqueHiRpm: 9000,
  idleRpm: 1100,
  redlineRpm: 11000,
  finalDrive: 3.10,
  gearRatios: [4.914,3.954,3.181,2.56,2.06,1.657,1.334],
  reverseRatio: 2.90,
  wheelRadiusM: .364,
  dragCd: .40,
  frontalAreaM2: 1.90,
  rollingResistance: .012,
  airDensity: 1.225,
  drivelineEff: .90,
  tractionCoeff: 1.197413524,
  topSpeedKmh: 402,
  topSpeedMps: 402 * KMH,
  topSpeedLimitedKmh: 402,
  topSpeedLimitedMps: 402 * KMH,
  topSpeedRecordKmh: 402,
  topSpeedRecordMps: 402 * KMH,
  zeroTo100Kmh: 2.3,
  hybrid: {peakPowerW:746000,peakPowerPS:1014,peakPowerHp:1000,peakTorqueNm:740},
  v12only:{peakPowerW:746000,peakPowerPS:1014,peakPowerHp:1000,peakTorqueNm:740},
  brakeMaxMps2: 12.4181,
  brakeDist100to0M: 26,
  shiftTimeS: .045,
  launchRpm: 5400,
  aeroClA: 6.4,
  aeroDragAdd: .38
};`, "Valkyrie AMR Pro spec");
    s = one(s, /    \/\/ \(KERS deploy changes the engine output rather than the aero; see toggleFuel\.\)/, `    // Le Mans trim sheds wing/floor load and drag; maximum-downforce trim restores it.
    if (state.hybrid) { rearT *= .82; frontT *= .84; dragT *= .58; }`, "Valkyrie aero trim physics");
    s = one(s, /    \/\/ KERS hybrid:[\s\S]*?\n  }\n\n  function toggleLights/, `  // AMR Pro has no KERS. This unique control changes the homologated aero setup only;
  // both positions retain the same naturally-aspirated 1,000 bhp V12 output.
  function toggleFuel() {
    state.hybrid = !state.hybrid;
    setActive("hybridBtn", state.hybrid);
    document.getElementById("hybridBtn").textContent = state.hybrid ? "Le Mans Trim" : "Max Downforce";
    audio.motor(.55); audio.click(state.hybrid ? 1200 : 760);
    showToast(state.hybrid ? "Le Mans trim — lower drag for the straight, full V12 output unchanged." : "Maximum downforce — floor and wing load restored, full V12 output unchanged.", "AMR Pro");
  }

  function toggleLights`, "Valkyrie trim control");
    s = s.replace('if (!state.hybrid) { state.hybrid = true; SPEC.peakPowerW = SPEC.hybrid.peakPowerW; SPEC.peakPowerPS = SPEC.hybrid.peakPowerPS; SPEC.peakPowerHp = SPEC.hybrid.peakPowerHp; SPEC.peakTorqueNm = SPEC.hybrid.peakTorqueNm; }', 'state.hybrid = true; document.getElementById("hybridBtn").textContent = "Le Mans Trim";');
    s = s.replace('if (!state.hybrid) warn.push("KERS OFF · V12 only, 1,014 PS");', 'if (!state.hybrid) warn.push("MAX DOWNFORCE · 1,014 PS V12");');
    s = s.replace('el.boostRead.textContent = `${Math.round(state.boostBar / 1.35 * 100)}%`;', 'el.boostRead.textContent = state.hybrid ? "LM" : "MAX";');
    s = s.replaceAll("KERS", "AMR AERO");
    s = s.replace("{ type: \"triangle\",   mul: 15,     gain: 0.09, toShaper: false },   // the e-motor inverter under the engine", '{ type: "triangle",   mul: 4.5,    gain: 0.09, toShaper: false },   // high-order intake and valvetrain edge');
    s = s.replaceAll("1,160 PS", "1,014 PS");
    s = s.replaceAll("1,140 hp", "1,000 bhp");
    s = s.replaceAll("350 km/h", "402 km/h");
    s = s.replaceAll("2.5 s", "2.3 s");
    s = s.replaceAll('"Valkyrie"', '"AMR Pro"');
    s = s.replaceAll("Aston Martin Valkyrie cockpit", "Aston Martin Valkyrie AMR Pro cockpit");
    s = s.replaceAll("Aston Martin Valkyrie side", "Aston Martin Valkyrie AMR Pro side");
    writeFileSync(file, s);
    console.log("updated Aston Martin Valkyrie AMR Pro");
  }
}

const F1_FILES = [
  "Mercedes F1 2026 simulator.html","Red Bull F1 2026 simulator.html","Ferrari F1 2026 simulator.html",
  "McLaren F1 2026 simulator.html","Aston Martin F1 2026 simulator.html","Alpine F1 2026 simulator.html",
  "Williams F1 2026 simulator.html","Racing Bulls F1 2026 simulator.html","Haas F1 2026 simulator.html",
  "Audi F1 2026 simulator.html","Cadillac F1 2026 simulator.html",
];

for (const name of F1_FILES) {
  const file = resolve(ROOT, name);
  let s = readFileSync(file, "utf8");
  if (s.includes("function mguKPowerKwAt")) { console.log(`already updated ${name}`); continue; }
  s = one(s, "    const rawForce = torqueAvail * state.throttle * harnessLimiter * shiftCut * ratio * SPEC.finalDrive * SPEC.drivelineEff * realPower() * (state.ersBoost ? ERS.boost : 1) * (state.strat === \"push\" ? 1.02 : state.strat === \"lean\" ? 0.98 : 1) / SPEC.wheelRadiusM;", `    // 2026 FIA electrical speed profile used by this simulator. In standard mode the
    // 350 kW MGU-K drops to 100 kW at 337 km/h and tapers to zero at 345 km/h.
    // Manual Override holds 350 kW to 355 km/h, then cuts electric output completely.
    function mguKPowerKwAt(speedKmh, overrideMode = false) {
      if (overrideMode) return speedKmh < 355 ? 350 : 0;
      if (speedKmh < 337) return 350;
      if (speedKmh < 345) return 100 * (345 - speedKmh) / 8;
      return 0;
    }
    app.mguKPowerKwAt = mguKPowerKwAt;
    const mguKw = mguKPowerKwAt(speedAbs / KMH, state.ersBoost);
    const hybridSpeedFactor = (400 + mguKw) / 750;
    const rawForce = torqueAvail * state.throttle * harnessLimiter * shiftCut * ratio * SPEC.finalDrive * SPEC.drivelineEff * hybridSpeedFactor * realPower() * (state.ersBoost ? ERS.boost : 1) * (state.strat === "push" ? 1.02 : state.strat === "lean" ? 0.98 : 1) / SPEC.wheelRadiusM;`, `${name} MGU-K curve`);
  s = one(s, "    const govMps = SPEC.topSpeedMps * realTop();", "    const govMps = (state.ersBoost ? 420 * KMH : SPEC.topSpeedMps) * realTop();", `${name} override ceiling`);
  s = s.replace("Hold <kbd>V</kbd> for full electric deploy past the 290 km/h taper.", "Hold <kbd>V</kbd> for Manual Override: standard deployment drops at 337 and reaches zero at 345 km/h; Override holds full MGU-K output to its 355 km/h cut.");
  s = s.replace("ERS Manual Override — full deploy past the taper. The store drains fast and recharges under braking.", "ERS Manual Override — full 350 kW deployment to 355 km/h, then electrical cut. The store drains fast and recharges under braking.");
  s = s.replace("<text x=\"150\" y=\"52\" text-anchor=\"middle\" font-family=\"ui-sans-serif\" font-size=\"6.5\" font-weight=\"700\" fill=\"#39d0e0\">MGU-H</text>", "<text x=\"150\" y=\"52\" text-anchor=\"middle\" font-family=\"ui-sans-serif\" font-size=\"6.5\" font-weight=\"700\" fill=\"#39d0e0\">TURBO</text>");
  writeFileSync(file, s);
  console.log(`updated ${name}`);
}
