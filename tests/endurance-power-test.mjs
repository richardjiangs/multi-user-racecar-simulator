#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  if (process.env.CODEX_NODE_MODULES) {
    return import(pathToFileURL(resolve(process.env.CODEX_NODE_MODULES, "playwright/index.mjs")).href);
  }
  throw new Error("Playwright is unavailable; set CODEX_NODE_MODULES to the bundled runtime modules.");
}

const { chromium } = await loadPlaywright();
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "✔" : "✘"} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

async function open(file, appName) {
  const page = await browser.newPage();
  await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
  await page.goto(pathToFileURL(resolve(ROOT, file)).href);
  await page.waitForFunction((name) => !!window[name]?.updatePhysics, appName);
  return page;
}

const porsche = await open("Porsche 919 Hybrid simulator.html", "Porsche919App");
const p = await porsche.evaluate(() => {
  const app = window.Porsche919App, s = app.state;
  app.resetCar(); s.ignition = true; app.setGear("G", 4); s.speedMps = 80; s.rpm = 8500;
  s.throttle = 1; s.hybridEnergy = 75; s.energyMode = 1; s.hybridLapUsedMJ = 0;
  const before = s.hybridEnergy, boostKw = app.hybridStep(1, true), after = s.hybridEnergy;
  s.hybridEnergy = 75; s.hybridLapUsedMJ = 8;
  const exhaustedLapKw = app.hybridStep(1 / 120, true);
  s.hybridLapUsedMJ = 5; app.selectCircuit("Circuit de la Sarthe — 2017");
  const resetAllowance = s.hybridLapUsedMJ;
  const fcy0 = s.fcy; app.prototypeControl("fcy"); const fcy1 = s.fcy;
  return { before, after, boostKw, exhaustedLapKw, resetAllowance, fcy0, fcy1 };
});
check("919 boost reaches the 294 kW front-MGU ceiling", p.boostKw > 293.9 && p.boostKw <= 294, `${p.boostKw.toFixed(1)} kW`);
check("919 boost spends finite stored energy", p.after < p.before, `${p.before.toFixed(1)}% → ${p.after.toFixed(1)}%`);
check("919 stops deploying after its 8 MJ lap allowance", p.exhaustedLapKw === 0, `${p.exhaustedLapKw.toFixed(1)} kW`);
check("919 starts a selected Le Mans lap with a fresh allowance", p.resetAllowance === 0);
check("919 wheel FCY control changes the actual limiter state", !p.fcy0 && p.fcy1);
await porsche.close();

const ferrari = await open("Ferrari 499P simulator.html", "Ferrari499PApp");
const f = await ferrari.evaluate(() => {
  const app = window.Ferrari499PApp, s = app.state;
  app.resetCar(); s.ignition = true; app.setGear("G", 6); s.throttle = 1; s.hybridEnergy = 100; s.energyMode = 1;
  s.speedMps = 180 / 3.6; const below = app.hybridStep(1 / 120, true);
  s.speedMps = 200 / 3.6; const above = app.hybridStep(1 / 120, true);
  s.keys.KeyW = true; s.speedMps = 250 / 3.6; s.hybridEnergy = 100; app.updatePhysics(1 / 120);
  const mgu = s.mguPowerKw, combined = s.powerUnitKw;
  const mode0 = s.energyMode; app.prototypeControl("map"); const mode1 = s.energyMode;
  return { below, above, mgu, combined, mode0, mode1 };
});
check("499P front ERS stays off below 190 km/h", f.below === 0, `${f.below.toFixed(1)} kW`);
check("499P front ERS reaches 200 kW above the threshold", f.above > 199.9 && f.above <= 200, `${f.above.toFixed(1)} kW`);
check("499P front ERS never exceeds 200 kW", f.mgu <= 200.001, `${f.mgu.toFixed(1)} kW`);
check("499P combined output remains inside the 500 kW BoP cap", f.combined <= 500.01, `${f.combined.toFixed(1)} kW`);
check("499P wheel strategy control changes the actual deployment map", f.mode0 !== f.mode1);
await ferrari.close();

const f1 = await open("Mercedes F1 2026 simulator.html", "MercedesF1App");
const curve = await f1.evaluate(() => {
  const fn = window.MercedesF1App.mguKPowerKwAt;
  return {
    standard290: fn(290, false), standard340: fn(340, false), standard345: fn(345, false),
    override3375: fn(337.5, true), override345: fn(345, true), override355: fn(355, true),
  };
});
check("F1 standard MGU-K is capped at 350 kW through 290 km/h", curve.standard290 === 350);
check("F1 standard MGU-K tapers to 100 kW at 340 km/h", curve.standard340 === 100);
check("F1 standard MGU-K cuts at 345 km/h", curve.standard345 === 0);
check("F1 Override holds 350 kW through 337.5 km/h", curve.override3375 === 350);
check("F1 Override tapers to 200 kW at 345 km/h", curve.override345 === 200);
check("F1 Override cuts at 355 km/h", curve.override355 === 0);
await f1.close();

const offline = await browser.newPage();
await offline.goto(pathToFileURL(resolve(ROOT, "index-offline.html")).href, { waitUntil: "domcontentloaded" });
const offlineCards = await offline.locator(".car-card").count();
check("offline garage contains all 64 cars", offlineCards === 64, `${offlineCards} cards`);
await offline.locator('[data-practice="porsche919"]').click();
await offline.waitForFunction(() => !!document.getElementById("simFrame")?.contentWindow?.Porsche919App, null, { timeout: 15000 });
const offline919 = await offline.evaluate(() => document.getElementById("simFrame").contentWindow.Porsche919App.SPEC.name);
check("offline garage boots the embedded 919 without a sibling-file request", offline919.includes("919"), offline919);
await offline.close();

await browser.close();
if (failures) process.exit(1);
console.log("All endurance and 2026 power checks passed.");
