#!/usr/bin/env node
/* ============================================================================
   FACTORY-FIGURE VERIFICATION HARNESS
   ----------------------------------------------------------------------------
   Loads every simulator HTML in headless Chromium and drives the REAL physics
   (the exported app.updatePhysics, fixed 1/120 s steps — the exact integrator
   the page runs) through:
     · a launch-control standing start  -> 0-100 / 0-200 / 0-300 km/h times
     · a flat-out run                   -> governed / drag-limited top speed
     · a 100-0 km/h brake test          -> stopping distance
   and asserts the results against each car's SPEC targets.

   0-100 km/h must match SPEC.zeroTo100Kmh to within ±0.0001 s — the SPEC's
   tractionCoeff is calibrated for precisely this harness.

   Usage:
     node tests/perf-test.mjs                 # verify all cars
     node tests/perf-test.mjs bugatti tesla   # verify some cars
     node tests/perf-test.mjs --calibrate mclaren   # print calibrated
              tractionCoeff / brakeMaxMps2 for the car's SPEC targets
   ============================================================================ */
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  const { execSync } = await import("node:child_process");
  const globalRoot = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(resolve(globalRoot, "playwright/index.mjs")).href);
}
const { chromium } = await loadPlaywright();

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const CARS = {
  bugatti: {
    file: "Bugatti Chiron Super Sport 300+ simulator.html",
    app: "BugattiApp",
    label: "Bugatti Chiron Super Sport 300+",
    marks: { 100: { target: 2.4, tol: 1e-4 }, 200: { target: 5.8, tol: 0.6 }, 300: { target: 12.1, tol: 1.0 } },
    topSpeed: { kmh: 490.5, setup: "speedKey", minT: 80 },
    brake100: { target: 31, tol: 1.0 },
  },
  pagani: {
    file: "Pagani Huayra BC Simulator.html",
    app: "PaganiApp",
    label: "Pagani Huayra BC",
    marks: { 100: { target: 2.8, tol: 1e-4 } },
    topSpeed: { kmh: 350, minT: 70 },
    brake100: { target: 30, tol: 1.0 },
  },
  mclaren: {
    file: "McLaren Speedtail simulator.html",
    app: "McLarenApp",
    label: "McLaren Speedtail",
    marks: { 100: { target: 3.0, tol: 1e-4 }, 300: { target: 12.8, tol: 0.02, calibrateEff: true } },
    topSpeed: { kmh: 403, setup: "velocity", minT: 90 },
    brake100: { target: 32, tol: 1.0 },
  },
  ferrari: {
    file: "Ferrari F80 simulator.html",
    app: "FerrariApp",
    label: "Ferrari F80",
    marks: { 100: { target: 2.15, tol: 1e-4 }, 200: { target: 5.75, tol: 0.02, calibrateEff: true } },
    topSpeed: { kmh: 350, minT: 70 },
    brake100: { target: 28, tol: 1.0 },
  },
  koenigsegg: {
    file: "Koenigsegg Jesko simulator.html",
    app: "KoenigseggApp",
    label: "Koenigsegg Jesko",
    marks: { 100: { target: 2.5, tol: 1e-4 } },
    // Attack aero: no factory top speed published — assert the drag-limited
    // vmax stays in a plausible Attack band and that E85 clearly outruns petrol.
    topSpeed: { minKmh: 350, maxKmh: 430, setup: "e85", minT: 90 },
    brake100: { target: 29, tol: 1.0 },
  },
  tesla: {
    file: "Tesla Model S Plaid simulator.html",
    app: "TeslaApp",
    label: "Tesla Model S Plaid",
    rollout: true,               // Tesla quotes acceleration with the 1-ft rollout subtracted
    marks: { 100: { target: 2.1, tol: 1e-4 } },
    quarterMile: { target: 9.23, tol: 0.01 },
    topSpeed: { kmh: 322, setup: "trackPack", minT: 60 },
    brake100: { target: 33, tol: 1.0 },
  },
  amg: {
    file: "Mercedes-AMG GT Black Series simulator.html",
    app: "AmgApp",
    label: "Mercedes-AMG GT Black Series",
    marks: { 100: { target: 3.2, tol: 1e-4 } },
    topSpeed: { kmh: 325, minT: 55 },     // electronically governed
    brake100: { target: 30, tol: 1.0 },
  },
  aston: {
    file: "Aston Martin Valkyrie simulator.html",
    app: "AstonApp",
    label: "Aston Martin Valkyrie",
    marks: { 100: { target: 2.5, tol: 1e-4 } },
    topSpeed: { kmh: 350, minT: 70 },
    brake100: { target: 28, tol: 1.0 },
  },
  gto: {
    file: "Ferrari 250 GTO simulator.html",
    app: "GtoApp",
    label: "Ferrari 250 GTO",
    marks: { 100: { target: 6.1, tol: 1e-4 } },
    topSpeed: { kmh: 280, minT: 60 },
    brake100: { target: 44, tol: 1.0 },
  },
  revuelto: {
    file: "Lamborghini Revuelto simulator.html",
    app: "RevueltoApp",
    label: "Lamborghini Revuelto",
    marks: { 100: { target: 2.5, tol: 1e-4 } },
    topSpeed: { kmh: 350, minT: 70 },
    brake100: { target: 30, tol: 1.0 },
  },
  porsche918: {
    file: "Porsche 918 Spyder simulator.html",
    app: "Porsche918App",
    label: "Porsche 918 Spyder",
    marks: { 100: { target: 2.6, tol: 1e-4 } },
    topSpeed: { kmh: 345, minT: 70 },
    brake100: { target: 30, tol: 1.0 },
  },
  taycan: {
    file: "Porsche Taycan Turbo GT simulator.html",
    app: "TaycanApp",
    label: "Porsche Taycan Turbo GT",
    marks: { 100: { target: 2.2, tol: 1e-4 } },
    topSpeed: { kmh: 305, minT: 60 },
    brake100: { target: 31, tol: 1.0 },
  },
  supra: {
    file: "Toyota GR Supra simulator.html",
    app: "SupraApp",
    label: "Toyota GR Supra",
    marks: { 100: { target: 4.1, tol: 1e-4 } },
    topSpeed: { kmh: 250, minT: 55 },     // electronically governed
    brake100: { target: 34, tol: 1.0 },
  },
  venom: {
    file: "Hennessey Venom F5 simulator.html", app: "VenomApp", label: "Hennessey Venom F5",
    marks: { 100: { target: 2.6, tol: 1e-4 } },
    topSpeed: { minKmh: 430, maxKmh: 490, minT: 90 },   // drag-limited (301 mph design target)
    brake100: { target: 30, tol: 1.0 },
  },
  zr1: {
    file: "Chevrolet Corvette ZR1 simulator.html", app: "Zr1App", label: "Chevrolet Corvette ZR1",
    marks: { 100: { target: 2.4, tol: 1e-4 } },
    topSpeed: { kmh: 375, minT: 60 },     // 233 mph governed
    brake100: { target: 30, tol: 1.0 },
  },
  evija: {
    file: "Lotus Evija simulator.html", app: "EvijaApp", label: "Lotus Evija",
    marks: { 100: { target: 2.9, tol: 1e-4 } },
    topSpeed: { kmh: 349, minT: 55 },     // governed
    brake100: { target: 31, tol: 1.0 },
  },
  nevera: {
    file: "Rimac Nevera simulator.html", app: "NeveraApp", label: "Rimac Nevera",
    marks: { 100: { target: 1.81, tol: 1e-4 } },
    topSpeed: { kmh: 412, minT: 70 },     // governed
    brake100: { target: 30, tol: 1.0 },
  },
  amgone: {
    file: "Mercedes-AMG One simulator.html", app: "AmgOneApp", label: "Mercedes-AMG One",
    marks: { 100: { target: 2.9, tol: 1e-4 } },
    topSpeed: { kmh: 352, minT: 60 },     // electronically governed
    brake100: { target: 30, tol: 1.0 },
  },
  p1: {
    file: "McLaren P1 simulator.html", app: "P1App", label: "McLaren P1",
    marks: { 100: { target: 2.8, tol: 1e-4 } },
    topSpeed: { kmh: 350, minT: 60 },     // electronically governed
    brake100: { target: 30, tol: 1.0 },
  },
};

/* 2026 Formula 1 grid — eleven teams built from one shared chassis SPEC (identical
   physics), so a single calibration certifies all eleven. Each is still verified so a
   later per-team SPEC edit can't drift unnoticed. No fixed top-speed governor: F1 top
   speed is drag-limited and varies with the active-aero mode, so assert a plausible band. */
const F1_TEAMS = [
  ["f1mercedes",   "Mercedes F1 2026 simulator.html",     "MercedesF1App",   "Mercedes-AMG F1 W17"],
  ["f1redbull",    "Red Bull F1 2026 simulator.html",     "RedbullF1App",    "Oracle Red Bull RB22"],
  ["f1ferrari",    "Ferrari F1 2026 simulator.html",      "FerrariF1App",    "Scuderia Ferrari SF-26"],
  ["f1mclaren",    "McLaren F1 2026 simulator.html",      "MclarenF1App",    "McLaren MCL40"],
  ["f1aston",      "Aston Martin F1 2026 simulator.html", "AstonF1App",      "Aston Martin AMR26"],
  ["f1alpine",     "Alpine F1 2026 simulator.html",       "AlpineF1App",     "BWT Alpine A526"],
  ["f1williams",   "Williams F1 2026 simulator.html",     "WilliamsF1App",   "Atlassian Williams FW48"],
  ["f1racingbulls","Racing Bulls F1 2026 simulator.html", "RacingbullsF1App","Racing Bulls VCARB03"],
  ["f1haas",       "Haas F1 2026 simulator.html",         "HaasF1App",       "MoneyGram Haas VF-26"],
  ["f1audi",       "Audi F1 2026 simulator.html",         "AudiF1App",       "Audi F1 A26"],
  ["f1cadillac",   "Cadillac F1 2026 simulator.html",     "CadillacF1App",   "Cadillac F1"],
];
for (const [key, file, app, label] of F1_TEAMS) {
  CARS[key] = {
    file, app, label,
    marks: { 100: { target: 2.6, tol: 1e-4 } },
    topSpeed: { minKmh: 330, maxKmh: 362, minT: 80 },   // drag-limited (active aero)
    brake100: { target: 17, tol: 1.5 },
  };
}

/* 2026 Dakar Rally — four T1+ Ultimate cars on ONE calibrated chassis SPEC (like the F1 grid):
   ~360 hp restricted, ~2,000 kg, 6-speed sequential, permanent 4WD, 37" tyres, 350 mm travel.
   Certification runs in Free run (no stage loaded), so the terrain/dune/bog physics — which are
   route-gated — never touch the launch, brake or top-speed runs. Top speed is the Dakar 170 km/h
   governor (× the car's tiny TEAM.top factor), so assert a tight band. */
const DAKAR_CARS = [
  ["dacia",    "Dacia Sandrider Dakar simulator.html", "DaciaDakarApp",    "Dacia Sandrider (T1+)"],
  ["fordraptor","Ford Raptor T1+ Dakar simulator.html","FordDakarApp",     "Ford Raptor T1+"],
  ["grhilux",  "Toyota GR DKR Hilux simulator.html",   "ToyotaDakarApp",   "Toyota GR DKR Hilux (T1+)"],
  ["hunter",   "Prodrive Hunter Dakar simulator.html", "ProdriveDakarApp", "Prodrive Hunter (BRX, T1+)"],
];
for (const [key, file, app, label] of DAKAR_CARS) {
  CARS[key] = {
    file, app, label,
    marks: { 100: { target: 5.3, tol: 1e-4 } },
    topSpeed: { minKmh: 165, maxKmh: 172, minT: 30 },   // Dakar 170 km/h governor
    brake100: { target: 40, tol: 1.5 },
  };
}

/* Runs inside the page. Everything below drives the sim's own exported code. */
const PAGE_FNS = {
  /* standing-start launch; returns interpolated mark times, top speed, 1/4 mile */
  launch: ({ appName, setup, maxT, stopAtKmh, assistOff, rollout }) => {
    const app = window[appName];
    const { state, SPEC } = app;
    const dt = 1 / 120, KMH = 1 / 3.6;
    for (const k in state.keys) state.keys[k] = false;
    app.resetCar();
    state.rivals = [];                                  // certification runs on a clear track
    state.ignition = true; state.started = true;
    if (assistOff) state.assist = false;
    if (setup === "speedKey" && app.toggleSpeedKey) app.toggleSpeedKey();
    if (setup === "velocity" && app.toggleVelocity) app.toggleVelocity();
    if (setup === "e85" && app.toggleFuel && !state.e85) app.toggleFuel();
    if (setup === "trackPack" && app.toggleTrackPack && !state.trackPack) app.toggleTrackPack();
    app.armLaunch();
    state.keys.KeyW = true;
    const marks = {}, want = [60 * 1.609344, 100, 200, 300, 400];
    let t = 0, prevV = 0, prevD = 0, top = 0, quarter = null, sinceTopGain = 0, rolloutT = null;
    const startDist = state.distanceM;
    for (let i = 0; i < Math.round((maxT || 90) * 120); i++) {
      app.updatePhysics(dt); state.time += dt; t += dt;
      const v = state.speedMps, d = state.distanceM - startDist;
      for (const k of want) {
        const mv = k * KMH;
        if (!(k in marks) && prevV < mv && v >= mv) marks[k] = t - dt + ((mv - prevV) / (v - prevV)) * dt;
      }
      // drag-strip 1-ft rollout instant (Tesla quotes times from here)
      if (rolloutT === null && prevD < 0.3048 && d >= 0.3048) rolloutT = t - dt + ((0.3048 - prevD) / (d - prevD)) * dt;
      if (quarter === null && d >= 402.336) quarter = t; // 1/4 mile
      if (v > top + 1e-9) { top = v; sinceTopGain = 0; } else sinceTopGain += dt;
      prevV = v; prevD = d;
      if (stopAtKmh && v >= stopAtKmh * KMH) break;
      if (!stopAtKmh && sinceTopGain > 6) break;          // settled at vmax
    }
    if (rollout && rolloutT != null) {                    // subtract rollout (manufacturer convention)
      for (const k in marks) marks[k] -= rolloutT;
      if (quarter != null) quarter -= rolloutT;
    }
    return { marks, topKmh: top * 3.6, settledKmh: state.speedMps * 3.6, quarter, rolloutT, gear: state.curGear, rpm: state.rpm, simTime: t };
  },
  /* 100-0 km/h braking distance, brake applied via the pedal input path */
  brake: ({ appName }) => {
    const app = window[appName];
    const { state } = app;
    const dt = 1 / 120, KMH = 1 / 3.6;
    for (const k in state.keys) state.keys[k] = false;
    app.resetCar();
    state.rivals = [];                                  // certification runs on a clear track
    state.ignition = true; state.started = true;
    app.setGear("G", 4);
    state.speedMps = 100 * KMH;
    state.keys.ArrowDown = true;                          // full brake demand
    state.brake = 1;                                      // measured from full pressure (standard test convention)
    const d0 = state.distanceM;
    let t = 0;
    while (state.speedMps > 0 && t < 20) { app.updatePhysics(dt); state.time += dt; t += dt; }
    return { dist: state.distanceM - d0, t };
  },
  /* calibration: binary-search a SPEC field against a launch/brake target */
  calibrate: ({ appName, field, target, mode, lo, hi, setup, markKmh, rollout }) => {
    const app = window[appName];
    const { state, SPEC } = app;
    const dt = 1 / 120, KMH = 1 / 3.6;
    const runLaunch = () => {
      for (const k in state.keys) state.keys[k] = false;
      app.resetCar();
      state.rivals = [];
    state.rivals = [];                                  // certification runs on a clear track
      state.ignition = true; state.started = true;
      if (setup === "e85" && app.toggleFuel && !state.e85) app.toggleFuel();
      app.armLaunch(); state.keys.KeyW = true;
      let t = 0, prevV = 0, prevD = 0, rolloutT = 0;
      const mv = (markKmh || 100) * KMH;
      const startDist = state.distanceM;
      for (let i = 0; i < 120 * 60; i++) {
        app.updatePhysics(dt); state.time += dt; t += dt;
        const v = state.speedMps, d = state.distanceM - startDist;
        if (rollout && rolloutT === 0 && prevD < 0.3048 && d >= 0.3048) rolloutT = t - dt + ((0.3048 - prevD) / (d - prevD)) * dt;
        if (prevV < mv && v >= mv) return (t - dt + ((mv - prevV) / (v - prevV)) * dt) - rolloutT;
        prevV = v; prevD = d;
      }
      return 1e9;
    };
    const runBrake = () => {
      for (const k in state.keys) state.keys[k] = false;
      app.resetCar();
      state.rivals = [];
    state.rivals = [];                                  // certification runs on a clear track
      state.ignition = true; state.started = true;
      app.setGear("G", 4); state.speedMps = 100 * KMH; state.keys.ArrowDown = true; state.brake = 1;
      const d0 = state.distanceM; let t = 0;
      while (state.speedMps > 0 && t < 20) { app.updatePhysics(dt); state.time += dt; t += dt; }
      return state.distanceM - d0;
    };
    const run = mode === "brake" ? runBrake : runLaunch;
    // measured value DECREASES as the field increases (more grip / more brake)
    let a = lo, b = hi;
    for (let i = 0; i < 60; i++) {
      const m = (a + b) / 2;
      SPEC[field] = m;
      const got = run();
      if (got > target) a = m; else b = m;
    }
    const final = (a + b) / 2;
    SPEC[field] = final;
    return { value: final, measured: run() };
  },
};

async function openSim(browser, car) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => { throw new Error(`[${car.label}] page error: ${e.message}`); });
  await page.goto(pathToFileURL(resolve(ROOT, car.file)).href);
  await page.waitForFunction((appName) => !!window[appName] && !!window[appName].updatePhysics, car.app, { timeout: 15000 });
  return page;
}

const fmt = (v, d = 4) => (v == null ? "—" : Number(v).toFixed(d));
let failures = 0;
const check = (label, ok, detail) => {
  console.log(`   ${ok ? "✔" : "✘ FAIL"}  ${label}${detail ? "  " + detail : ""}`);
  if (!ok) failures++;
};

async function verifyCar(browser, key) {
  const car = CARS[key];
  const page = await openSim(browser, car);
  console.log(`\n▶ ${car.label}`);

  const run = await page.evaluate(PAGE_FNS.launch, { appName: car.app, setup: null, maxT: 40, stopAtKmh: 310, rollout: !!car.rollout });
  for (const [kmh, m] of Object.entries(car.marks)) {
    const got = run.marks[kmh];
    if (got == null && Number(kmh) > 200) { check(`0-${kmh} km/h reachable in 40 s`, false); continue; }
    const ok = got != null && Math.abs(got - m.target) <= m.tol;
    check(`0-${kmh} km/h = ${fmt(got)} s (target ${m.target} ±${m.tol})`, ok);
  }
  if (car.quarterMile) {
    const q = await page.evaluate(PAGE_FNS.launch, { appName: car.app, setup: "trackPack", maxT: 20, stopAtKmh: 0, rollout: !!car.rollout });
    const ok = q.quarter != null && Math.abs(q.quarter - car.quarterMile.target) <= car.quarterMile.tol;
    check(`1/4 mile = ${fmt(q.quarter, 2)} s (target ${car.quarterMile.target} ±${car.quarterMile.tol})`, ok);
  }
  const vs = car.topSpeed;
  // vmax is a manual run: assist off so the auto aero isn't holding downforce trim
  const vRun = await page.evaluate(PAGE_FNS.launch, { appName: car.app, setup: vs.setup || null, maxT: vs.minT + 120, stopAtKmh: 0, assistOff: true });
  if (vs.kmh != null) {
    // settled speed sits ON the governor exactly; topKmh may carry a one-step transient
    check(`top speed = ${fmt(vRun.settledKmh, 2)} km/h (governed ${vs.kmh})`, Math.abs(vRun.settledKmh - vs.kmh) <= 0.01);
  } else {
    check(`top speed = ${fmt(vRun.topKmh, 1)} km/h (drag-limited, expected ${vs.minKmh}–${vs.maxKmh})`,
      vRun.topKmh >= vs.minKmh && vRun.topKmh <= vs.maxKmh);
  }
  const br = await page.evaluate(PAGE_FNS.brake, { appName: car.app });
  check(`100-0 km/h = ${fmt(br.dist, 2)} m (target ${car.brake100.target} ±${car.brake100.tol})`,
    Math.abs(br.dist - car.brake100.target) <= car.brake100.tol);
  await page.close();
}

async function calibrateCar(browser, key) {
  const car = CARS[key];
  const page = await openSim(browser, car);
  console.log(`\n▶ calibrating ${car.label}`);
  const t100 = car.marks[100].target;
  // when a factory mid-range mark exists (e.g. Speedtail 0-300), calibrate the lumped
  // driveline/hybrid-taper efficiency against it, interleaved with the grip calibration
  const midMark = Object.entries(car.marks).find(([kmh, m]) => Number(kmh) > 100 && m.calibrateEff);
  for (let pass = 0; pass < (midMark ? 3 : 1); pass++) {
    if (midMark) {
      const [kmh, m] = midMark;
      const eff = await page.evaluate(PAGE_FNS.calibrate, {
        appName: car.app, field: "drivelineEff", target: m.target, mode: "launch", markKmh: Number(kmh), lo: 0.55, hi: 0.99,
      });
      console.log(`   drivelineEff  = ${eff.value.toFixed(6)}   -> 0-${kmh} = ${eff.measured.toFixed(5)} s (target ${m.target})`);
    }
    const grip = await page.evaluate(PAGE_FNS.calibrate, {
      appName: car.app, field: "tractionCoeff", target: t100, mode: "launch", lo: 0.3, hi: 2.6, rollout: !!car.rollout,
    });
    console.log(`   tractionCoeff = ${grip.value.toFixed(6)}   -> 0-100 = ${grip.measured.toFixed(5)} s (target ${t100})`);
  }
  if (car.brake100) {
    const bk = await page.evaluate(PAGE_FNS.calibrate, {
      appName: car.app, field: "brakeMaxMps2", target: car.brake100.target, mode: "brake", lo: 6, hi: 20,
    });
    console.log(`   brakeMaxMps2  = ${bk.value.toFixed(4)}   -> 100-0 = ${bk.measured.toFixed(3)} m (target ${car.brake100.target})`);
  }
  await page.close();
}

const args = process.argv.slice(2);
const calibrate = args.includes("--calibrate");
const keys = args.filter((a) => CARS[a]);
const list = keys.length ? keys : Object.keys(CARS);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  for (const key of list) {
    try {
      if (calibrate) await calibrateCar(browser, key);
      else await verifyCar(browser, key);
    } catch (e) {
      if (String(e.message || e).includes("ENOENT") || String(e.message || e).includes("net::ERR_FILE_NOT_FOUND")) {
        console.log(`\n▶ ${CARS[key].label}\n   ⤷ skipped (file not written yet)`);
      } else { console.log(`\n▶ ${CARS[key].label}\n   ✘ ${e.message || e}`); failures++; }
    }
  }
} finally {
  await browser.close();
}
console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
