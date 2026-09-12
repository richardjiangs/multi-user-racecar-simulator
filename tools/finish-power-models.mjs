// Final corrections to the interrupted September endurance/F1 update.
// Stage every file in memory before writing, and assert each migration anchor.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const ROOT = resolve(import.meta.dirname, '..');
const staged = new Map();
function one(s, a, b) {
  const matches = typeof a === 'string' ? s.split(a).length - 1 : [...s.matchAll(new RegExp(a.source, a.flags.includes('g') ? a.flags : a.flags + 'g'))].length;
  if (matches !== 1) throw new Error(`Expected one anchor (${matches}): ${String(a).slice(0,100)}`);
  return s.replace(a, () => b);
}
for (const file of readdirSync(ROOT).filter(f => /F1 2026 simulator\.html$/.test(f))) {
  let s = readFileSync(resolve(ROOT, file), 'utf8');
  if (s.includes('FIA C5.2.8: continuous electrical power envelope')) continue;
  const curve = `  // FIA C5.2.8: continuous electrical power envelope (Issue 16, 27 February 2026).
  // https://www.fia.com/system/files/documents/fia_2026_f1_regulations_-_section_c_technical_-_iss_16_-_2026-02-27.pdf
  // The 350 kW cap intersects the standard line at 290 and Override at 337.5 km/h.
  function mguKPowerKwAt(speedKmh, overrideMode = false) {
    const v = Math.max(0, speedKmh);
    return clamp(overrideMode ? 7100 - 20 * v : v < 340 ? 1800 - 5 * v : 6900 - 20 * v, 0, 350);
  }
  app.mguKPowerKwAt = mguKPowerKwAt;

`;
  s = one(s, '  /* --- engine torque (identical curve to the verification test) --- */', curve + '  /* --- engine torque (identical curve to the verification test) --- */');
  s = one(s, /    \/\/ 2026 FIA electrical speed profile[\s\S]*?    const cap = tractionCapN\(\);/, `    // Override changes only the electrical speed envelope. It cannot multiply ICE power,
    // bypass battery depletion, or create electric output past 355 km/h.
    const mguAvailable = state.hybrid && state.ersStore > 0.001 && !state.retired && !state.inPitLane;
    const mguKw = mguAvailable ? mguKPowerKwAt(speedAbs / KMH, state.ersBoost) : 0;
    const iceKw = 400 * (state.strat === "push" ? 1.02 : state.strat === "lean" ? 0.98 : 1);
    const requestedPowerW = (iceKw + mguKw) * 1000;
    const hybridSpeedFactor = requestedPowerW / SPEC.peakPowerW;
    const outputW = Math.min(torqueAvail * state.rpm * Math.PI * 2 / 60 * hybridSpeedFactor, requestedPowerW);
    const deliveredW = canMove ? outputW * state.throttle * harnessLimiter * shiftCut * realPower() : 0;
    state.mguKPowerKw = canMove ? mguKw * state.throttle * harnessLimiter * shiftCut : 0;
    state.powerUnitKw = deliveredW / 1000;
    const rawForce = torqueAvail * state.throttle * harnessLimiter * shiftCut * ratio * SPEC.finalDrive * SPEC.drivelineEff * hybridSpeedFactor * realPower() / SPEC.wheelRadiusM;
    // Full-throttle standard deployment spends the store too. Reduced-speed taper extends
    // its duration; lift/coast and braking harvest. Usable energy is the FIA 4 MJ window;
    // per-team regeneration remains a simplified tuning, not a proprietary engine map.
    const used = state.mguKPowerKw / 4000; // 4 MJ usable energy window
    const recovered = state.ignition && speedAbs > 8 && state.throttle < .25
      ? ERS.regen * (state.brake > .2 ? 3.5 : 1) : 0;
    state.ersStore = clamp(state.ersStore + dt * (recovered - used), 0, 1);
    const cap = tractionCapN();`);
  s = one(s, '    state.ersStore = clamp(state.ersStore + dt * (state.ersBoost ? -1 / ERS.storeS : state.brake > 0.2 ? ERS.regen * 3.5 : _spdc > 8 ? ERS.regen : 0), 0, 1);', '    // Energy accounting follows actual delivered MGU-K power below.');
  s = one(s, '    const govMps = (state.ersBoost ? 420 * KMH : SPEC.topSpeedMps) * realTop();', '    const govMps = 500 * KMH; // numerical safety bound; velocity is determined by power and drag');
  s = s.replaceAll('full 350 kW deployment to 355 km/h, then electrical cut', '350 kW to 337.5 km/h, tapering to zero at 355 km/h');
  s = s.replaceAll('standard deployment drops at 337 and reaches zero at 345 km/h; Override holds full MGU-K output to its 355 km/h cut', 'standard deployment tapers from 290 to zero at 345 km/h; Override tapers from 337.5 to zero at 355 km/h');
  s = s.replace('const p = app.engineTorque(state.rpm) * (state.rpm * Math.PI * 2 / 60) * clamp(state.throttle, 0, 1);', 'const p = (state.powerUnitKw || 0) * 1000;');
  s = s.replace('deploying = !!state.ersBoost;', 'deploying = (state.mguKPowerKw || 0) > 0;');
  s = s.replace('ctx.fillText(deploying ? "ERS DEPLOY" : "ERS STORE",', 'ctx.fillText(Math.round(state.mguKPowerKw || 0) + " kW MGU-K",');
  s = s.replace('xMode: false, ersBoost: false, ersStore: 1, strat:', 'xMode: false, ersBoost: false, ersStore: 1, mguKPowerKw: 0, powerUnitKw: 0, strat:');
  staged.set(file, s);
}
for (const [file, s] of staged) { writeFileSync(resolve(ROOT, file), s); console.log(file); }
